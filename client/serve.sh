#!/bin/bash

cp ./client/serve.json ./client/build/serve.json
serve --ssl-cert ./server/config/sslcerts/server.crt \
    --ssl-key ./server/config/sslcerts/server.key \
    --no-clipboard \
    --config ./serve.json \
    -s ./client/build