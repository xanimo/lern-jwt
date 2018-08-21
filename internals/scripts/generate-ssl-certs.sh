#!/bin/bash

if [ ! -e index.js ]
then
	echo "Error: could not find main application server file"
	echo "You should run the generate-ssl-certs.sh script from the main MERN application root directory"
	echo "i.e: bash scripts/generate-ssl-certs.sh"
	exit -1
fi

echo "Generating self-signed certificates..."
mkdir -p ./server/config/sslcerts
openssl genrsa -des3 -out ./server/config/sslcerts/rootCA.key 2048
openssl req -x509 -new -nodes -key ./server/config/sslcerts/rootCA.key -sha256 -days 1024 -out ./server/config/sslcerts/rootCA.pem
openssl x509 -in ./server/config/sslcerts/rootCA.pem -inform PEM -out ./server/config/sslcerts/rootCA.crt 
sudo mkdir /usr/share/ca-certificates/extra
sudo cp ./server/config/sslcerts/rootCA.crt /usr/share/ca-certificates/extra/rootCA.crt
sudo dpkg-reconfigure ca-certificates
openssl req -new -sha256 -nodes -out ./server/config/sslcerts/server.csr -newkey rsa:2048 -keyout ./server/config/sslcerts/server.key -config <( cat ./server/config/sslcerts/server.csr.cnf )
openssl x509 -req -in ./server/config/sslcerts/server.csr -CA ./server/config/sslcerts/rootCA.pem -CAkey ./server/config/sslcerts/rootCA.key -CAcreateserial -out ./server/config/sslcerts/server.crt -days 500 -sha256 -extfile ./server/config/sslcerts/v3.ext

# openssl genrsa -out ./server/config/sslcerts/key.pem 4096
# openssl req -new -key ./server/config/sslcerts/key.pem -out ./server/config/sslcerts/csr.pem
# openssl x509 -req -days 365 -in ./server/config/sslcerts/csr.pem -signkey ./server/config/sslcerts/key.pem -out ./server/config/sslcerts/cert.pem
# rm ./server/config/sslcerts/csr.pem
# chmod 600 ./server/config/sslcerts/key.pem ./server/config/sslcerts/cert.pem