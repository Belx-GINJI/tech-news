@echo off
chcp 65001 >nul
echo.
echo ============================================
echo  Tech News - スタートアップ解除ツール
echo ============================================
echo.

set "TARGET=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\TechNews-AutoStart.vbs"

if exist "%TARGET%" (
    del "%TARGET%"
    echo [OK] スタートアップから解除しました。
) else (
    echo スタートアップに登録されていません。
)

echo.
pause
