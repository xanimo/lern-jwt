#!/bin/bash

if [[ "$2" ]]; then
if grep -R -q "$2" $1; then
    echo true
else
    echo false
fi
else
    if [[ -f "$1" ]]; then
        echo true
    else
        echo false
    fi
fi

