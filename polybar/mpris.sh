#!/bin/bash

# Specifying the icon(s) in the script
# This allows us to change its appearance conditionally
icon_play=""
icon_pause=""

player_status=$(playerctl status 2> /dev/null)
if [[ $? -eq 0 ]]; then
    metadata="$(playerctl metadata title) - $(playerctl metadata artist)"
fi

# Foreground color formatting tags are optional
if [[ $player_status = "Playing" ]]; then
    echo "%{F$(xrdb -query | grep '*color2'| awk '{print $NF}')}$icon_play $metadata"       # Orange when playing
elif [[ $player_status = "Paused" ]]; then
    echo "%{F$(xrdb -query | grep '*color4'| awk '{print $NF}')}$icon_pause $metadata"       # Greyed out info when paused
else
    echo "%{F$(xrdb -query | grep '*color7'| awk '{print $NF}')}$icon"                 # Greyed out icon when stopped
fi
