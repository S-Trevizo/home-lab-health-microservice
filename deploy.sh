#!/bin/bash
set -e
git -C /home/xeon/repos/home-lab-health-microservice pull
sudo -u xeon /docker/manage.sh restart healthcheck