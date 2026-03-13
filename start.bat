@echo off
title Tech News Aggregator
cd /d c:\News
echo.
echo  ========================================
echo   Tech News Aggregator を起動しています...
echo  ========================================
echo.
start "" http://localhost:3000
npm run dev
