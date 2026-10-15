@echo off
chcp 65001 >nul
title Khởi Tạo Cơ Sở Dữ Liệu MySQL
echo ========================================================
echo   NẠP & RESET CSDL HỆ THỐNG QUẢN LÝ KHO (PTTKPM_REBUILD)
echo ========================================================
echo.
set MYSQL_CMD=mysql
if exist "C:\xampp\mysql\bin\mysql.exe" set MYSQL_CMD="C:\xampp\mysql\bin\mysql.exe"
if exist "D:\xampp\mysql\bin\mysql.exe" set MYSQL_CMD="D:\xampp\mysql\bin\mysql.exe"

echo Đang kết nối tới MySQL localhost:3306 (user root)...
echo 1. Khởi tạo cấu trúc bảng (rebuild_schema.sql)...
%MYSQL_CMD% -u root --port=3306 < database\rebuild_schema.sql

echo 2. Nạp dữ liệu ban đầu (rebuild_seed.sql)...
%MYSQL_CMD% -u root --port=3306 < database\rebuild_seed.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   [THÀNH CÔNG] Đã tạo CSDL pttkpm_rebuild và nạp dữ liệu mẫu!
    echo ========================================================
) else (
    echo.
    echo [LƯU Ý] Nếu gặp lỗi kết nối, vui lòng kiểm tra:
    echo   1. Đã bật MySQL trên XAMPP / Laragon chưa?
    echo   2. MySQL có đang chạy trên cổng 3306 với user 'root' không mật khẩu không?
)
echo.
pause
