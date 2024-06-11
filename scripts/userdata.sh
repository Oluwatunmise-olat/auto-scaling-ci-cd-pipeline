#!/bin/bash

chmod +x .

function loadEnvFromParameterGroupAndSetOnEc2() {}

NODE_VERSION="18.0.0"
DEPLOYMENT_BRANCH=${DEPLOYMENT_BRANCH}

function updateAndInstallPackegesForAmazonLinux() {
  yum update -y;
  yum install -y httpd git;
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

  ${BUILD_CMD}

  # For quicker instance restarts if an uncaught error occurs instead of replacing the whole instance
  pm2 start yarn --name=${APP_NAME} --restart-delay=5000 -- start #5 seconds
}

updateAndInstallPackegesForAmazonLinux &> /dev/null
installNodeVersionManager &> /dev/null
pullApplicationCodeFromGithubAndStartUp