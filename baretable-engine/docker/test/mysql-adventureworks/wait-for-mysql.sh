#!/bin/sh

while ! mysqladmin ping -h"127.0.0.1" --silent; do
    sleep 1
    echo 'Waiting for server...'
done