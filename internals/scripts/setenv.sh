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

echo random=$(openssl rand -base64 32) >> password
APP_SECRET=$(echo $(source password; echo $random))

echo NODE_ENV=production > .env
echo ID= >> .env
echo PASSWORD= >> .env
echo DB_PATH=./data >> .env
nohup ./internals/scripts/getsin.sh
cp .env ./client/.env
echo APP_SECRET="$APP_SECRET" >> .env
echo PORT=3001 >> .env
echo PUBLIC_URL=https://localhost:3001 >> .env
./internals/scripts/diff.sh .env ./client/.env ID
rm nohup.out password

echo "Randomized environment variables have been written"
