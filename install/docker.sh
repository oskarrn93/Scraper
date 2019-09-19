#/bin/bash

sudo apt update
sudo apt upgrade -y

#https://docs.docker.com/install/linux/docker-ce/ubuntu/
sudo apt remove docker docker-engine docker.io containerd runc -y
sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt install docker-ce docker-ce-cli containerd.io -y
docker --version

#https://docs.docker.com/compose/install/
sudo apt install py-pip python-dev libffi-dev openssl-dev gcc libc-dev make -y
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version

docker pull node:12
docker pull mongo:4.2-bionic