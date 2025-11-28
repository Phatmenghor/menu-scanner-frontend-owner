#!/bin/bash

# Get current date and time
CURRENT_TIME=$(date "+%Y-%m-%d %H:%M:%S")

# Get current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Get changed files list
CHANGES=$(git status --short | awk '{print $2}' | tr '\n' ' ')

# Add all changes
git add .

# Commit with detailed message
git commit -m "[$BRANCH] Auto commit on $CURRENT_TIME | Files: $CHANGES"

# Push to current branch
git push origin $BRANCH

echo "✅ Code pushed to '$BRANCH' at $CURRENT_TIME"
