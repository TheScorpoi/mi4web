#!/bin/bash

echo 'eva,bernas, alexandre, sobral, goncalo' | grep -q ${USER} 
if [ $? -ne 0 ] ; then
    sudo chown www-data ./app_auth/Files
fi
gnome-terminal -- docker-compose up
cd uap/
source venv/bin/activate
echo 'eva,bernas, alexandre, sobral, goncalo' | grep -q ${USER} 
if [ $? -ne 0 ] ; then
    pip3 install -r requirements.txt
fi
gnome-terminal -- python3 uap.py
cd ../app_auth/
source venv/bin/activate
echo 'eva,bernas, alexandre, sobral, goncalo' | grep -q ${USER} 
if [ $? -ne 0 ] ; then
    pip3 install -r requirements.txt
fi
gnome-terminal -- python3 server.py
sleep 20
xdg-open http://localhost:8000/main.php
