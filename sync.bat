@echo off

for /F "tokens=2" %%i in ('date /t') do set mydate=%%i
set mytime=%time%

@echo on

git add .
git commit -m "%mydate%:%mytime%"
git pull
git push

pause
