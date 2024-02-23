#!/bin/bash

if cat /proc/1/cgroup | tail -n 1 | grep -q 'init.scope'; then
    echo mongo
else
    echo 127.0.0.1
fi
