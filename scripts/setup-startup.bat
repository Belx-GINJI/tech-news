@echo off
chcp 65001 >nul
echo.
echo ============================================
echo  Tech News - スタートアップ登録ツール
echo ============================================
echo.

set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "VBS=c:\News\scripts\start-server.vbs"

if not exist "%VBS%" (
    echo [エラー] %VBS% が見つかりません。
    pause
    exit /b 1
)

copy "%VBS%" "%STARTUP%\TechNews-AutoStart.vbs" >nul

if %errorlevel%==0 (
    echo [OK] スタートアップに登録しました。
    echo.
    echo   次回のPC起動時から自動的に:
    echo     1. ニュースサーバーがバックグラウンドで起動
    echo     2. 5秒後にブラウザで http://localhost:3000 が開きます
    echo.
    echo   解除するには unregister-startup.bat を実行してください。
) else (
    echo [エラー] 登録に失敗しました。
)

echo.
pause
