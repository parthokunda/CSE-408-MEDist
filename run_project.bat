@echo off

REM check port 3000, 3001, 3002, 3003, 3004, 3005 is free or not, if not free, kill the process
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /f /pid %%a
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do taskkill /f /pid %%a
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3002" ^| find "LISTENING"') do taskkill /f /pid %%a
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3003" ^| find "LISTENING"') do taskkill /f /pid %%a
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3004" ^| find "LISTENING"') do taskkill /f /pid %%a
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3005" ^| find "LISTENING"') do taskkill /f /pid %%a


REM ================================ Comment this section if you don't want to install dependencies ================================

REM Check and install dependencies for each project folder
for %%F in (Auth_Service Patient_Service Doctor_Service Medicine_Service Appointment_Service proxy) do (

    REM open a new cmd window in each folder
    start cmd /k "cd %%~F\"

    REM check if package.json is present in the folder
    if exist %%~F\package.json (
        REM check if node_modules is present in the folder
        if not exist %%~F\node_modules (
            
            REM run pnpm i if node_modules is not present and wait for it to finish
            echo node_modules not found in %%~F, running pnpm i...
            pushd %%~F
            pnpm i
            popd

        ) else (
            echo node_modules found in %%~F
        )
        
    ) else (
        echo package.json not found in %%~F
    ) 
    
)

REM close the current cmd window
taskkill /f /im cmd.exe


REM ================================ to this portion  ================================


REM run the project
for %%F in (Auth_Service Patient_Service Doctor_Service Medicine_Service Appointment_Service proxy) do (

    REM open a new cmd window in each folder and run the project
    start cmd /k "cd %%~F\ && pnpm dev"
)





