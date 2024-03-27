#!/bin/sh

if [ $(command -v docker-compose) ]; then
  docker-compose down
  docker-compose up --build -d
else
  docker compose down
  docker compose up --build -d
fi
