@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo   Aggiornamento dati Maxi Formati (Excel -^> sito)
echo ============================================================
echo.
echo [1/2] Ottimizzo e normalizzo le foto...
python ottimizza-foto-maxi.py
if errorlevel 1 py ottimizza-foto-maxi.py
echo.
echo [2/2] Rigenero i dati di galleria e mappa...
python build-maxi-data.py
if errorlevel 1 py build-maxi-data.py
echo.
echo ------------------------------------------------------------
echo   Fatto. Per pubblicare online, esegui poi:
echo     git add -A ^&^& git commit -m "aggiorna maxi" ^&^& git push
echo ------------------------------------------------------------
pause
