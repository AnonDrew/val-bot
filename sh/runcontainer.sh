#!/bin/bash

hostDir=$1;
contDir=$2;
image=$3;
cpp=$4;
proj=$5;
projDir=$6;

cppNoExt=${cpp%.*};

if [ ! $# -eq 4 -a ! $# -eq 6 ]; then
    echo "Invalid argument count. Must be 4 or 6.";
    exit 1;
fi

if [ $# -eq 6 ]; then
    projExt1=${proj#*.};
    projExt2=${projExt1%.*};

    if [ $projExt1 -eq "zip" ]; then
        unzip $projDir/$proj -d $hostDir;
    elif [ $projExt2 -eq "tar" ]; then
        tar -xf $projDir/$proj -C $hostDir;
    else
        echo "Unsupported archive format.";
        exit 1;
    fi
fi

#--ulimit:
#found that container fd limit was being set to 1073741816
#this triggered an assert in valgrind's source: Assertion 'newfd >= VG_(fd_hard_limit)' failed

#--log-driver:
#off due to limited space on free hosting services

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
