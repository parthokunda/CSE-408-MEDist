@echo off

REM check port 3000, 3001, 3002, 3003, 3004, 3005 is free or not, if not free, kill the process
@REM for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /f /pid %%a
@REM for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do taskkill /f /pid %%a
@REM for /f "tokens=5" %%a in ('netstat -aon ^| find ":3002" ^| find "LISTENING"') do taskkill /f /pid %%a
@REM for /f "tokens=5" %%a in ('netstat -aon ^| find ":3003" ^| find "LISTENING"') do taskkill /f /pid %%a
@REM for /f "tokens=5" %%a in ('netstat -aon ^| find ":3004" ^| find "LISTENING"') do taskkill /f /pid %%a
@REM for /f "tokens=5" %%a in ('netstat -aon ^| find ":3005" ^| find "LISTENING"') do taskkill /f /pid %%a


@REM REM ================================ Comment this section if you don't want to install dependencies ================================

@REM REM Check and install dependencies for each project folder
@REM for %%F in (Auth_Service Patient_Service Doctor_Service Medicine_Service Appointment_Service proxy) do (

@REM     REM open a new cmd window in each folder
@REM     start cmd /k "cd %%~F\"

@REM     REM check if package.json is present in the folder
@REM     if exist %%~F\package.json (
@REM         REM check if node_modules is present in the folder
@REM         if not exist %%~F\node_modules (
            
@REM             REM run pnpm i if node_modules is not present and wait for it to finish
@REM             echo node_modules not found in %%~F, running pnpm i...
@REM             pushd %%~F
@REM             pnpm i
@REM             popd

@REM         ) else (
@REM             echo node_modules found in %%~F
@REM         )
        
@REM     ) else (
@REM         echo package.json not found in %%~F
@REM     ) 
    
@REM )

@REM REM close the current cmd window
@REM taskkill /f /im cmd.exe


@REM REM ================================ to this portion  ================================


REM run the project
for %%F in (Auth_Service Patient_Service Doctor_Service Medicine_Service Appointment_Service proxy) do (

    REM open a new cmd window in each folder and run the server and name the window with the folder name
    start cmd /k "cd %%~F\ && pnpm dev" /title %%~F
)





