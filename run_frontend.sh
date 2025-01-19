#!/bin/bash

# Change directory to the frontend folder
cd /home/lubuntu/capstone-project-3900h18bGitGud/frontend

# Check npm is installed
if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not installed. Please install npm to continue."
  exit 1
fi

# Check dependencies are installed
if ! npm list >/dev/null 2>&1; then
  echo "Some dependencies are missing. Installing dependencies using npm..."
  npm install
fi

# Run the frontend
npm start
