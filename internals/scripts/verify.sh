#!/bin/bash

file=$(source .env; echo $P2PKH_ADDRESS)
message=$(cat $file | sed -n 's/message: //p')
content=$(cat $file | sed -n 's/content: //p')
address=$(cat $file | sed -n 's/address: //p')
./libdogecoin/such -c verifymessage -x $message -s $content -k $(source .env; echo $P2PKH_ADDRESS) > output

if $(cat output | tail -n 1 | grep -q 'Message is verified!'); then
    echo true
    rm output $file
else
    echo false
fi
