#!/bin/bash
echo "Starting Toy Cart Studio Backend Server..."
echo ""
echo "Server will run on: http://localhost:8000"
echo "API Base URL: http://localhost:8000/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
cd "$(dirname "$0")"
php -S localhost:8000 router.php

