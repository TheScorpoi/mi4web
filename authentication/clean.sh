#!/bin/bash

cd uap

if [ -f "bd.json" ] ; then
    rm "bd.json"
fi

if [ -f "filekey.key" ] ; then
    rm "filekey.key"
fi

if [ -f "password.json" ] ; then
    rm "password.json"
fi

if [ -f "salt.txt" ] ; then
    rm "salt.txt"
fi