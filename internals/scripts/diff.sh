#!/bin/bash

touch ./client/.env
echo "REACT_APP_SECRET=" > ./client/.env
echo "REACT_APP_ID=" >> ./client/.env
echo "REACT_APP_PASSWORD=" >> ./client/.env
echo "REACT_APP_PRIVATE_KEY_WIF=" >> ./client/.env
echo "REACT_APP_PRIVATE_KEY_HEX=" >> ./client/.env
echo "REACT_APP_PUBLIC_KEY_HEX=" >> ./client/.env
echo "REACT_APP_SIN=" >> ./client/.env
chmod +x ./client/.env

count=$(diff $1 $2 | grep -o $3 | wc -l)

if [[ "$count" == 2 ]]; then
    server_secret=$(source .env; echo $APP_SECRET);
    server_id=$(source .env; echo $ID);
    server_password=$(source .env; echo $PASSWORD);
    server_private_key_wif=$(source .env; echo $PRIVATE_KEY_WIF)
    server_private_key_hex=$(source .env; echo $PRIVATE_KEY_HEX)
    server_public_key_hex=$(source .env; echo $PUBLIC_KEY_HEX)
    server_sin=$(source .env; echo $SIN)
    ./internals/scripts/replace.sh ./client/.env REACT_APP_SECRET = $server_secret
    ./internals/scripts/replace.sh ./client/.env REACT_APP_ID = $server_id
    ./internals/scripts/replace.sh ./client/.env REACT_APP_PASSWORD = $server_password
    ./internals/scripts/replace.sh ./client/.env REACT_APP_PRIVATE_KEY_WIF = $server_private_key_wif
    ./internals/scripts/replace.sh ./client/.env REACT_APP_PRIVATE_KEY_HEX = $server_private_key_hex
    ./internals/scripts/replace.sh ./client/.env REACT_APP_PUBLIC_KEY_HEX = $server_public_key_hex
    ./internals/scripts/replace.sh ./client/.env REACT_APP_SIN = $server_sin
    chmod +x ./client/.env
    echo true
else
    echo false
fi
