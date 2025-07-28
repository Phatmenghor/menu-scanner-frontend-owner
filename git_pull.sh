#!/bin/bash

# Get current date and time
CURRENT_TIME=$(date "+%Y-%m-%d %H:%M:%S")
# Commit with date-time message
git fetch
# Push to main branch
git pull origin development

echo "✅ Code pushed to 'development' branch at $CURRENT_TIME"
