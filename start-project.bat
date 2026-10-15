@echo off
chcp 65001 >nul
title Khởi Động Hệ Thống Quản Lý Kho Hàng Điện Thoại
echo ========================================================
echo   KHỞI ĐỘNG HỆ THỐNG QUẢN LÝ KHO HÀNG ĐIỆN THOẠI (PTTKPM)
echo ========================================================
echo.
echo [1/3] Kiểm tra môi trường Node.js...
node -v
if %errorlevel% neq 0 (
    echo [LỖI] Chưa tìm thấy Node.js! Vui lòng cài đặt Node.js từ https://nodejs.org
    pause
    exit /b
)

echo.
echo [2/3] Đang khởi động Backend Server (Port 3002)...
start "PTTKPM - Backend API (Port 3002)" cmd /k "cd server && npm start"

echo Chờ 3 giây để Backend khởi tạo...
timeout /t 3 >nul

echo.
echo [3/3] Đang khởi động Frontend Web Client (Port 3000)...
start "PTTKPM - Frontend Client (Port 3000)" cmd /k "cd web_client && npm start"

echo.
echo ========================================================
echo   HỆ THỐNG ĐANG ĐƯỢC MỞ TRÊN TRÌNH DUYỆT:
echo   - Frontend:      http://localhost:3000
echo   - Backend API:   http://localhost:3002
echo   - Tài khoản test: admin / 123456
echo ========================================================
echo.
echo Bạn có thể thu nhỏ cửa sổ này lại. Khi muốn dừng, hãy đóng các cửa sổ dòng lệnh.
pause
