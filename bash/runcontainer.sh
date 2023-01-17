#!/bin/bash

runcontainer () {
    local hostDir=$1;
    local contDir=$2;
    local image=$3;
    local cpp=$4;
    local cppNoExt=${cpp%.*};

    docker run --rm \
    --log-driver=none \
    --ulimit nofile=1024:1024 \
    -v $hostDir:$contDir \
    $image \
    /bin/bash -c \
    "\
    g++ -o $contDir/$cppNoExt.out --std=c++17 $contDir/$cpp && \
    valgrind --log-file=\"$contDir/$cppNoExt.txt\" --track-origins=yes --leak-check=full $contDir/$cppNoExt.out\
    ";
}

runcontainer "$1" "$2" "$3" "$4";
