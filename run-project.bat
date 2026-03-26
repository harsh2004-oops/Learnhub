@echo off
echo Starting Learning Platform with MySQL Backend...

echo [1/4] Starting Frontend...
start cmd /k "npm run dev"

echo [2/4] Installing Backend deps if needed...
cd server
npm install

echo [3/4] Setup MySQL tables (learning_platform DB)...
mysql -u root -p learning_platform -e "source schema.sql"

echo [4/4] Starting Backend...
start cmd /k "node index.js"

echo.
echo ========================================
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3001/health  
echo MySQL: All data persistent in 'learning_platform'
echo ========================================
echo Press any key to exit...
pause >nul

