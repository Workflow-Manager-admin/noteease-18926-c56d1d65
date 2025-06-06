#!/bin/bash
cd /home/kavia/workspace/code-generation/noteease-18926-c56d1d65/noteease_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

