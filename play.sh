#!/bin/bash

# Run your program and store the output
output=$(tsc index.ts && node index.js)

# Check the exit code of the program
if [ $? -eq 0 ]; then
    # If the program was successful, write the output to a file
    echo "$output" > notes.json
    node ~/Workspace/midisender/playmidi.js notes.json
else
    # If the program failed, print the output to the screen
    echo "$output"
fi