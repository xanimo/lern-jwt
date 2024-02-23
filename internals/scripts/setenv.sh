#!/bin/bash

rawurlencode() {
  local string="${1}"
  local strlen=${#string}
  local encoded=""
  local pos c o

  for (( pos=0 ; pos<strlen ; pos++ )); do
     c=${string:$pos:1}
     case "$c" in
        [-_.~a-zA-Z0-9] ) o="${c}" ;;
        * )               printf -v o '%%%02x' "'$c"
     esac
     encoded+="${o}"
  done
  echo "${encoded}"
}

rawurldecode() {
  printf -v REPLY '%b' "${1//%/\\x}"
}

echo base_hash=$(openssl rand -base64 32) > password
echo random=$(openssl rand -base64 32) >> password
echo $(openssl passwd -in password -salt $(source password; echo $base_hash))
echo $(openssl passwd -in password -salt $(source password; echo $random))
echo $(source password; echo $random)
APP_SECRET=$(echo $(source password; echo $random))
ADMIN_PASSWORD=$(source password; echo $bash_hash)
USER_PASSWORD=$(source password; echo $base_hash)

echo APP_SECRET="$APP_SECRET" > .env
echo PORT=3001 >> .env 
echo PUBLIC_URL=https://localhost:3001 >> .env
echo NODE_ENV=production >> .env
echo MONGO_INITDB_ROOT_USERNAME=admin >> .env
echo MONGO_INITDB_ROOT_PASSWORD="$ADMIN_PASSWORD" >> .env
echo MONGODB_USER=user >> .env
echo MONGODB_PASSWORD="$USER_PASSWORD" >> .env
echo MONGODB_URI="mongodb://user:$(rawurlencode $USER_PASSWORD)@$(./internals/scripts/inside):27017/users?ssl=true&tlsInsecure=true&retryWrites=true&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=users&authMechanism=SCRAM-SHA-256" >> .env

echo "Randomized environment variables have been written"
