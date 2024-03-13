#!/bin/bash

if $(./internals/scripts/exists.sh $1); then
    query=$(source $1; echo $2);
    if [[ $((${#query} > 0)) == 1 ]]; then
        sed -i s/$2$3.*/$2$3$4/ $1
    else
        echo false
    fi
    echo true
else
    echo false
fi
