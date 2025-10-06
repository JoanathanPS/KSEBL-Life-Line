@echo off
echo ==========================================
echo Kerala Line Break Detection System Setup
echo ==========================================
echo.

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing dependencies!
    pause
    exit /b 1
)

echo.
echo Step 2: Creating necessary directories...
if not exist "logs" mkdir logs
if not exist "uploads" mkdir uploads
if not exist "server\ml" mkdir server\ml

echo.
echo Step 3: Copying environment template...
if not exist ".env" (
    copy config-template.env .env
    echo .env file created from template
) else (
    echo .env file already exists
)

echo.
echo Step 4: Generating JWT secret...
node -e "const crypto = require('crypto'); console.log('JWT_SECRET=' + crypto.randomBytes(32).toString('hex'))" >> .env.temp
echo JWT secret generated

echo.
echo Step 5: Setup completed!
echo.
echo Next steps:
echo 1. Edit .env file with your database and email credentials
echo 2. Run: npm run db:push
echo 3. Run: npm run db:seed
echo 4. Run: npm run dev
echo.
echo Press any key to continue...
pause > nul
