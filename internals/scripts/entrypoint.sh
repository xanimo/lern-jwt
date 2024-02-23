#!/bin/bash

CONTAINER_ALREADY_STARTED="CONTAINER_ALREADY_STARTED_PLACEHOLDER"
if [ ! -e $CONTAINER_ALREADY_STARTED ]; then
    COUNTER=0
    while (nc -z $(./internals/scripts/inside) 27017) && [[ $COUNTER -lt 60 ]] ; do
        sleep 2
        let COUNTER+=2
        echo "Waiting for mongo to initialize... ($COUNTER seconds so far)"
    done
    touch $CONTAINER_ALREADY_STARTED
    echo "-- First container startup --"
    NODE_ENV=production npm run server-prod
fi
