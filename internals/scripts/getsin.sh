#!/bin/bash

if [[ ! -f ./libdogecoin/such ]]; then
  pushd ./libdogecoin
    ./autogen.sh
    ./configure
    make
  popd
fi

./libdogecoin/such -c generate_private_key >> .env
cat .env | sed -E 's/(private key wif: )/PRIVATE_KEY_WIF=/' | tee .env
cat .env | sed -E 's/(private key hex: )/PRIVATE_KEY_HEX=/' | tee .env
PRIVATE_KEY_WIF=$(sed -n 's/PRIVATE_KEY_WIF=//p' .env)
./libdogecoin/such -c generate_public_key -p $(echo $PRIVATE_KEY_WIF) >> .env
cat .env | sed -E 's/(public key hex: )/PUBLIC_KEY_HEX=/' | tee .env
cat .env | sed -E 's/(p2pkh address: )/P2PKH_ADDRESS=/' | tee .env
PUBLIC_KEY_HEX=$(sed -n 's/PUBLIC_KEY_HEX=//p' .env)
echo SIN=$(node ./internals/scripts/sin.js $(echo $PUBLIC_KEY_HEX)) >> .env
