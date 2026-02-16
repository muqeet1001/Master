@echo off
REM ============================================================================
REM Complete Git Reset - Start Fresh
REM ============================================================================
REM This script will:
REM 1. Delete all Git history
REM 2. Remove all commits
REM 3. Create a fresh Git repository
REM 4. Make an initial commit
REM ============================================================================

echo.
echo ============================================================================
echo WARNING: This will DELETE ALL Git history and commits!
echo ============================================================================
echo.
echo This action will:
echo   - Remove all previous commits
echo   - Delete all Git history
echo   - Create a fresh repository
echo   - Make a new initial commit
echo.
echo This CANNOT be undone!
echo.
set /p confirm="Are you sure you want to continue? (yes/no): "

if /i not "%confirm%"=="yes" (
    echo.
    echo Operation cancelled.
    pause
    exit /b 0
)

echo.
echo [1/4] Removing old Git repository...
echo.

REM Remove .git directory
if exist ".git" (
    rmdir /s /q .git
    echo Old Git repository removed
) else (
    echo No Git repository found
)

echo.
echo [2/4] Creating fresh Git repository...
echo.

REM Initialize new Git repository
git init
if errorlevel 1 (
    echo ERROR: Failed to initialize Git repository
    echo Make sure Git is installed
    pause
    exit /b 1
)

echo.
echo [3/4] Adding all files...
echo.

REM Add all files
git add .
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo.
echo [4/4] Creating initial commit...
echo.

REM Create initial commit
git commit -m "Initial commit - Fresh start"
if errorlevel 1 (
    echo ERROR: Failed to create commit
    pause
    exit /b 1
)

echo.
echo ============================================================================
echo SUCCESS! Git repository has been reset
echo ============================================================================
echo.
echo Your repository now has:
echo   - 1 commit (Initial commit)
echo   - Clean history
echo   - All current files
echo.
echo Next steps:
echo   1. Add remote: git remote add origin YOUR_REPO_URL
echo   2. Push: git push -u origin main --force
echo.
pause
