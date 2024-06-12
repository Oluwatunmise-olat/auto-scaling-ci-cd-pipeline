#!/bin/bash

chmod +x .

REGION=$(TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` &> /dev/null && curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/placement/region)

echo $REGION

# create .env
function loadEnvFromParameterGroupAndSetOnEc2() {
  DATA=$(aws ssm get-parameters-by-path --path=/app/staging --region=$REGION--with-decryption)
  DATA=$(echo $DATA | jq -r '.Parameters | map({Name, Value})')

  readarray -t DATA < <(echo $DATA | jq -c '.[]')

  for env in "${DATA[@]}"; do
    name=$(echo $env | jq ".Name" | awk -F'/' '{sub(/"/, "", $NF); print $NF;}')
    value=$(echo $env | jq -r ".Value")

    echo "export $name=\"$value\"" >> ~/.bashrc
  done

  source ~/.bashrc
}

NODE_VERSION="18.0.0"
DEPLOYMENT_BRANCH=${DEPLOYMENT_BRANCH}

function updateAndInstallPackegesForAmazonLinux() {
  sudo yum update;
  sudo yum install -y httpd git;
}

function installNodeVersionManager() {
  cd /tmp/node-version-manager;
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash;

  export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh";

  source ~/.bashrc;

  nvm install ${NODE_VERSION};
  nvm use ${NODE_VERSION};
}

function pullApplicationCodeFromGithubAndStartUp() {
  mkdir -p app && cd app;

  git clone https://${GIT_USERNAME}:${GIT_TOKEN}@${GIT_REPOSITORY} . &> /dev/null;
  git pull https://${GIT_USERNAME}:${GIT_TOKEN}@${GIT_REPOSITORY} ${DEPLOYMENT_BRANCH} &> /dev/null;

  npm install -g yarn
  yarn install
  yarn global add pm2

  ${BUIL_D_CMD}

  # For quicker instance restarts if an uncaught error occurs instead of replacing the whole instance
  pm2 start yarn --name=${APP_NAME} --restart-delay=5000 -- start #5 seconds
}

loadEnvFromParameterGroupAndSetOnEc2 &> /dev/null
updateAndInstallPackegesForAmazonLinux &> /dev/null
installNodeVersionManager &> /dev/null
pullApplicationCodeFromGithubAndStartUp