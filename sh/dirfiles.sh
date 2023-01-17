#!/bin/bash

dirfiles () {
    local dir=$1;

    find $dir -maxdepth 1 -type f -printf '%P\n';
}

dirfiles "$1";
