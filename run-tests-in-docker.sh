#!/bin/sh

if [ $(command -v docker-compose) ]; then
  docker-compose exec -T tests yarn cypress run --headless
else
  docker compose exec -T tests yarn cypress run --headless
fi
