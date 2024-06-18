#!/bin/bash
chmod +x .

NODE_VERSION="18.18.0"

AWS_METADATA_TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
AWS_VM_REGION=$(curl -H "X-aws-ec2-metadata-token: $AWS_METADATA_TOKEN" http://169.254.169.254/latest/meta-data/placement/region)


function loadEnvFromParameterGroupAndSetOnEc2() {
  DATA=$(aws ssm get-parameters-by-path --path=/app/staging --region=$AWS_VM_REGION --with-decryption)
  DATA=$(echo $DATA | jq -r '.Parameters | map({Name, Value})')

  readarray -t DATA < <(echo $DATA | jq -c '.[]')

  for env in "${DATA[@]}"; do
    name=$(echo $env | jq ".Name" | awk -F'/' '{sub(/"/, "", $NF); print $NF;}')
    value=$(echo $env | jq -r ".Value")

    echo "export $name=\"$value\"" >> ~/.bashrc
  done
}



function updateAndInstallPackegesForUbuntu() {
  sudo apt-get update -y;
  sudo apt-get install -y git python3-pip;
  sudo rm /usr/lib/python3.*/EXTERNALLY-MANAGED && sudo pip3 install awscli;
}

function installNodeVersionManager() {
  mkdir -p /tmp/node-version-manager && cd /tmp/node-version-manager;
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash;

  export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh";

  source ~/.bashrc;

  nvm install ${NODE_VERSION};
  nvm use ${NODE_VERSION};
}

function pullApplicationCodeFromGithubAndStartUp() {
  mkdir -p ~/app && cd ~/app;

  git clone https://"$GIT_USERNAME":"$GIT_TOKEN"@"$GIT_REPOSITORY" .;
  git checkout "$DEPLOYMENT_BRANCH";
  git pull https://"$GIT_USERNAME":"$GIT_TOKEN"@"$GIT_REPOSITORY" "$DEPLOYMENT_BRANCH";

  npm install -g yarn typescript pm2;
  yarn install;

  $BUILD_CMD

  # For quicker instance restarts if an uncaught error occurs instead of replacing the whole instance
  pm2 start yarn --name=$APP_NAME --restart-delay=5000 -- start #5 seconds
}

updateAndInstallPackegesForUbuntu
loadEnvFromParameterGroupAndSetOnEc2 && source ~/.bashrc
installNodeVersionManager &> /dev/null
pullApplicationCodeFromGithubAndStartUp