#!/bin/bash
chmod +x .

exec > /var/log/userdata.success.log 2>  /var/log/userdata.error.log

NODE_VERSION="18.18.0"
WORK_DIR="/home/ubuntu"

AWS_METADATA_TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
AWS_VM_REGION=$(curl -H "X-aws-ec2-metadata-token: $AWS_METADATA_TOKEN" http://169.254.169.254/latest/meta-data/placement/region)

function loadEnvFromParameterGroupAndSetOnEc2() {
  DATA=$(aws ssm get-parameters-by-path --path=/app/staging --region=$AWS_VM_REGION --with-decryption)
  DATA=$(echo $DATA | jq -r '.Parameters | map({Name, Value})')

  readarray -t DATA < <(echo $DATA | jq -c '.[]')

  for env in "${DATA[@]}"; do
    name=$(echo $env | jq ".Name" | awk -F'/' '{sub(/"/, "", $NF); print $NF;}')
    value=$(echo $env | jq -r ".Value")

    sudo echo "export $name=\"$value\"" >> /etc/profile
    source /etc/profile
  done
}

function updateAndInstallPackegesForUbuntu() {
  sudo apt-get update -y
  sudo apt-get install -y git python3-pip jq
  sudo rm /usr/lib/python3.*/EXTERNALLY-MANAGED
  sudo pip3 install awscli
}

function installNodeVersionManager() {
  mkdir -p /tmp/node-version-manager && cd /tmp/node-version-manager
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

  export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

  echo "export NVM_DIR=\"$NVM_DIR\"" | sudo tee -a /etc/profile
  echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' | sudo tee -a /etc/profile

  # NVM initialization script for the current session
  . "$NVM_DIR/nvm.sh"

  nvm install ${NODE_VERSION}
  nvm use ${NODE_VERSION}
}

function pullApplicationCodeFromGithubAndStartUp() {
  sudo -u ubuntu -i <<EOF
  source /etc/profile
  source ~/.profile
  mkdir -p "${WORK_DIR}"/app && cd "${WORK_DIR}"/app

  if [ -z "$GIT_USERNAME" ] || [ -z "$GIT_TOKEN" ] || [ -z "$GIT_REPOSITORY" ]; then
    echo "One or more required environment variables (GIT_USERNAME, GIT_TOKEN, GIT_REPOSITORY) are not set."
    exit 1
  fi

  git clone https://"$GIT_USERNAME":"$GIT_TOKEN"@"$GIT_REPOSITORY" .
  git checkout "$DEPLOYMENT_BRANCH"
  git pull https://"$GIT_USERNAME":"$GIT_TOKEN"@"$GIT_REPOSITORY" "$DEPLOYMENT_BRANCH"
  npm install -g yarn typescript pm2
  yarn install
  $BUILD_CMD
  pm2 start yarn --name=$APP_NAME --restart-delay=5000 -- start
EOF
}

cd $WORK_DIR
updateAndInstallPackegesForUbuntu
loadEnvFromParameterGroupAndSetOnEc2 && source /etc/profile
installNodeVersionManager &> /dev/null
pullApplicationCodeFromGithubAndStartUp