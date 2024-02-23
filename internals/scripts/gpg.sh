#!/bin/bash

echo Key-Type: 1 > gen-key
echo Key-Length: 2048 >> gen-key
echo Subkey-Type: 1 >> gen-key
echo Subkey-Length: 2048 >> gen-key
echo Name-Real: some user >> gen-key
echo Name-Email: some@email.com >> gen-key
echo Passphrase: $APP_SECRET >> gen-key
echo Expire-Date: 0 >> gen-key

gpg --default-new-key-algo rsa4096 --batch --gen-key gen-key

echo GPG_SECRET=$(rawurlencode $APP_SECRET) >> .env
echo GPG_SECRET_RAW=$APP_SECRET >> .env
