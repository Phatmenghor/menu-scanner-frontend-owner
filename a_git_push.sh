#!/bin/bash

# Exit immediately if any command fails
set -e

# Get current date and time
CURRENT_TIME=$(date "+%Y-%m-%d %H:%M:%S")

# Get current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Fetch & pull latest changes first
git fetch origin
git pull origin "$BRANCH"

# Get changed files list
CHANGES=$(git status --short | awk '{print $2}' | tr '\n' ' ')

# Check if there are changes
if [ -z "$CHANGES" ]; then
  echo "ℹ️ Nothing to commit, working tree clean"
else
  # Add all changes
  git add .

  # Commit with detailed message
  git commit -m "[$BRANCH] Auto commit on $CURRENT_TIME | Files: $CHANGES"
fi

# Push to current branch
git push origin "$BRANCH"

echo "✅ Code pushed to '$BRANCH' at $CURRENT_TIME"
