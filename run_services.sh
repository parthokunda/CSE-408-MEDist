#!/bin/bash

# if gnome-terminal not installed
# sudo apt-get install gnome-terminal 

gnome-terminal -- bash -c "cd Auth_Service/ && npm run dev; exec bash"
gnome-terminal -- bash -c "cd Patient_Service/ && npm run dev; exec bash"
gnome-terminal -- bash -c "cd Medicine_Service/ && npm run dev; exec bash"
gnome-terminal -- bash -c "cd proxy/ && npm run dev; exec bash"