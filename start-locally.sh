#!/bin/sh

docker compose start database & yarn --cwd ./backend/ start & yarn --cwd ./frontend/ start
