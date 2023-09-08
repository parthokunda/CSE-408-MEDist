@echo off


@REM REM ================================ Comment this section if you don't want to install dependencies ================================
@REM for /d %%d in (*) do (
@REM     pushd "%%d"
@REM     if not exist node_modules (
@REM         echo node_modules not found in %%~d, running pnpm i...
@REM         start "%%~nd" cmd /C "title=%%~nd && pnpm i"
@REM     ) else (
@REM         echo node_modules found in %%~d
@REM     )
@REM     popd
@REM )
@REM REM ================================ to this portion  ================================




REM Execute the kill_ports.bat script to terminate ports
pushd %~dp0
start /wait cmd /C "npx kill-port 3000 3001 3002 3003 3004 3005"
popd



for /d %%d in (*) do (
    pushd "%%d"
    start "%%~nd" cmd /K "title=%%~nd && pnpm run dev"
    popd
)





