#!/bin/bash

# if port 3000 is blocked, need sudo permission. you may run in sudo mode from the beginning

# if gnome-terminal not installed
# sudo apt-get install gnome-terminal

if [ $# -eq 0 ]; then
    gnome-terminal -- bash -c "cd Auth_Service/ && npm run dev; exec bash"
    gnome-terminal -- bash -c "cd Patient_Service/ && npm run dev; exec bash"
    gnome-terminal -- bash -c "cd Medicine_Service/ && npm run dev; exec bash"
    if ss -tuln | grep -q ":3000"; then
        echo "Port $PORT is occupied."
        PID=$(sudo lsof -t -i :3000)
        echo "Terminating process with PID $PID..."
        sudo kill $PID
        gnome-terminal -- bash -c "cd proxy/ && npm run dev; exec bash"
    else
        gnome-terminal -- bash -c "cd proxy/ && npm run dev; exec bash"
    fi
fi

if [ $# -eq 1 ]; then
    if [ "$1" = "partho" ]; then
        for PID in $(sudo lsof -t -i :3000-3010); do
            echo "Terminating process with PID $PID..."
            sudo kill $PID
        done
        for folder in *; do
            if [ -d "$folder" ]; then
                pushd $folder >> /dev/null
                pnpm i 
                gnome-terminal --title="$folder" -- bash -c "pnpm run dev; exec bash"
                popd >> /dev/null
            fi
        done
    fi
fi
