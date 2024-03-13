#!/bin/bash

key=$(source .env; echo $PRIVATE_KEY_WIF)
./libdogecoin/such -c signmessage -x $1 -p $key > $(source .env; echo $P2PKH_ADDRESS)
