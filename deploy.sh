#!/bin/bash
set -e
git -C /home/xeon/repos/home-lab-health-microservice pull
docker compose -f /docker/healthcheck/compose.yaml up -d --build