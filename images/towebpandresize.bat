@echo off
REM -------------------------------
REM Конвертация JPEG → WebP с бэкапом
REM Убираем оригиналы после конверсии
REM -------------------------------

REM 1. Создаем папку для бэкапа
if not exist backup (
    mkdir backup
)

REM 2. Копируем все JPG и JPEG в backup
copy *.jpg backup\
copy *.jpeg backup\

REM 3. Конвертация и ресайз в WebP с качеством 85% (JPG)
for %%f in (*.jpg) do (
    magick "%%f" -resize 1920x1920^> -quality 85 "%%~nf.webp"
    del "%%f"
)

REM 4. Конвертация и ресайз в WebP с качеством 85% (JPEG)
for %%f in (*.jpeg) do (
    magick "%%f" -resize 1920x1920^> -quality 85 "%%~nf.webp"
    del "%%f"
)
