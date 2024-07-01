#!/bin/bash
chmod +x .

AWS_METADATA_TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
VM_REGION=$(curl -H "X-aws-ec2-metadata-token: $AWS_METADATA_TOKEN" http://169.254.169.254/latest/meta-data/placement/region)

function loadEnvFromSecretsManagerAndSetOnEc2() {
  SECRETS=$(aws secretsmanager get-secret-value --secret-id prod/match-fixtures --region $VM_REGION --query 'SecretString')

  if [ -z "$SECRETS" ]; then
    echo "Error: secrets to found"
    return 1
  fi

  # Parse the secrets by replacing escaped double quotes with regular double quotes and removing surrounding quotes if present
  SECRETS=$(echo "$SECRETS" | sed 's/^"\(.*\)"$/\1/' | sed 's/\\\"/"/g')


  echo "$SECRETS" | jq -r 'to_entries[] | "export \(.key)=\(.value | @sh)"' | while IFS= read -r line; do
    echo "$line" | sudo tee -a /etc/profile >/dev/null
  done

  source /etc/profile
}

function installCodeDeployAgent() {
  sudo apt-get install -y ruby-full
  cd /home/ubuntu

  wget https://aws-codedeploy-us-west-2.s3.us-west-2.amazonaws.com/latest/install
  chmod +x ./install

  sudo ./install auto
  sudo systemctl start codedeploy-agent
  sudo systemctl enable codedeploy-agent
}

function updateAndInstallPackegesForUbuntu() {
  sudo apt-get update -y
  sudo apt-get install -y git python3-pip jq
  sudo rm /usr/lib/python3.*/EXTERNALLY-MANAGED
  sudo pip3 install awscli
}

updateAndInstallPackegesForUbuntu
loadEnvFromSecretsManagerAndSetOnEc2 && source /etc/profile
installCodeDeployAgent