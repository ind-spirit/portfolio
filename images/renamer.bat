@echo off
setlocal enabledelayedexpansion

set "folder=%cd%"
set "thisfile=%~nx0"
set /a counter=1

:: Временные имена (исключаем .bat файлы)
for /f "delims=" %%F in ('powershell -NoProfile -Command ^
    "Get-ChildItem -File -Path '%folder%' | Where-Object { $_.Extension -ne '.bat' -and $_.Name -ne '%thisfile%' } | Get-Random -Count ((Get-ChildItem -File -Path '%folder%' | Where-Object { $_.Extension -ne '.bat' -and $_.Name -ne '%thisfile%' } | Measure-Object).Count) | ForEach-Object { $_.FullName }"') do (
    set "ext=%%~xF"
    ren "%%F" "temp_!counter!!ext!"
    set /a counter+=1
)

set /a counter=1

:: Финальные номера
for %%F in (temp_*.*) do (
    set "ext=%%~xF"
    ren "%%F" "!counter!!ext!"
    set /a counter+=1
)
