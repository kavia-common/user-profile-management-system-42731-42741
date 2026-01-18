#!/bin/bash
cd /home/kavia/workspace/code-generation/user-profile-management-system-42731-42741/web_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

