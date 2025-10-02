@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

set "start=1"
set "tmpdir=__tmp_%RANDOM%_%RANDOM%"

mkdir "%tmpdir%" >nul 2>&1

set /a filesFound=0

for %%E in (jpg jpeg webp JPG JPEG WEBP) do (
  for %%F in (*.%%E) do (
    if exist "%%F" (
      move /Y "%%F" "%tmpdir%\" >nul
      if not errorlevel 1 set /a filesFound+=1
    )
  )
)

if %filesFound%==0 (
  rd "%tmpdir%" >nul 2>&1
  exit /b 0
)

pushd "%tmpdir%"
set /a n=%start%

for %%A in (*.*) do (
  set "ext=%%~xA"
  move /Y "%%~fA" "%~dp0!n!!ext!" >nul
  set /a n+=1
)

popd
rd "%tmpdir%" >nul 2>&1

endlocal
exit
