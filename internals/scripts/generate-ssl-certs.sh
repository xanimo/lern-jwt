#!/bin/bash

if [ ! -e index.js ]
then
	echo "Error: could not find main application server file"
	echo "You should run the generate-ssl-certs.sh script from the main lern application root directory"
	echo "i.e: bash scripts/generate-ssl-certs.sh"
	exit -1
fi

echo "Generating self-signed certificates..."
pushd server/config/sslcerts/
openssl genrsa -out rootCA.key 2048
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem -config <( cat server.csr.cnf )
openssl x509 -in rootCA.pem -inform PEM -out rootCA.crt 
openssl req -new -sha256 -nodes -out server.csr -newkey rsa:2048 -keyout server.key -config <( cat server.csr.cnf )
openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 500 -sha256 -extfile v3.ext
popd
