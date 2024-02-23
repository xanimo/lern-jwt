#!/bin/bash

echo "************************************************************"
echo "Setting up users..."
echo "************************************************************"

# create root user
nohup gosu mongodb mongosh admin --eval "db.createUser({user: 'admin', pwd: '$(source .env; echo $MONGO_INITDB_ROOT_PASSWORD)', roles:[{ role: 'root', db: 'admin' }, { role: 'read', db: 'local' }]});"

# create app user/database
nohup gosu mongodb mongosh users --eval "db.createUser({ user: 'user', pwd: '$(source .env; echo $MONGODB_PASSWORD)', roles: [{ role: 'readWrite', db: 'users' }, { role: 'read', db: 'local' }]});"

echo "************************************************************"
echo "Shutting down"
echo "************************************************************"
nohup gosu mongodb mongosh admin --eval "db.shutdownServer();"
