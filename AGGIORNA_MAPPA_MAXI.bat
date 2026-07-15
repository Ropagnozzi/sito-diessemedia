@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo   Aggiornamento dati Maxi Formati (Excel -^> sito)
echo ============================================================
echo.
python build-maxi-data.py
if errorlevel 1 py build-maxi-data.py
echo.
echo ------------------------------------------------------------
echo   Fatto. Per pubblicare online, esegui poi:
echo     git add -A ^&^& git commit -m "aggiorna maxi" ^&^& git push
echo ------------------------------------------------------------
pause
