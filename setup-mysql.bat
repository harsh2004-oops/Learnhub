@echo off
echo Installing backend dependencies...
cd server
npm install

echo.
echo Creating tables in MySQL (learning_platform DB)...
mysql -u root -p learning_platform -e "source server/schema.sql"

echo.
echo Backend setup complete! Run: node server/index.js
echo Test: Open http://localhost:3001/health
pause

