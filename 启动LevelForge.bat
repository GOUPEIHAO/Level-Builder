@echo off
chcp 65001 >nul
title LevelForge - 游戏关卡白盒搭建与空间分析工作台
cd /d "%~dp0"
echo ===================================================
echo   LevelForge 专业关卡设计与 AI 协同工作台
echo   本地服务启动中，正在开启 3D/2D 视口与 AI 桥接器...
echo   本地访问地址: http://localhost:5173/
echo ===================================================
echo.
npm start
pause
