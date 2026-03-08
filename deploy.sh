#!/bin/bash
set -e
git -C /home/xeon/repos/home-lab-health-microservice pull
sudo /docker/manage.sh restart healthcheck