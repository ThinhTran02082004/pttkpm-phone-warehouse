# PHÁT TRIỂN PHẦN MỀM QUẢN LÝ KHO HÀNG ĐIỆN THOẠI

## 1. Giới thiệu đề tài
Dự án là một ứng dụng web quản lý toàn diện dành cho doanh nghiệp vừa và nhỏ, bao gồm các chức năng quản lý kho, bán hàng, nhân viên, đối tác và báo cáo thống kê. Hệ thống giúp tối ưu hóa quy trình nhập xuất hàng hóa, theo dõi doanh thu và phân quyền chi tiết cho từng vai trò trong doanh nghiệp.

## 2. Tính năng chính (Features)
Hệ thống bao gồm các phân hệ chính:

*   **Quản lý Sản phẩm (Product Management):**
    *   Xem danh sách, tìm kiếm, lọc sản phẩm.
    *   Thêm mới, cập nhật, xóa sản phẩm.
    *   Quản lý danh mục và giá cả.

*   **Quản lý Kho (Warehouse Management):**
    *   **Nhập kho:** Tạo phiếu nhập, quản lý nhà cung cấp.
    *   **Xuất kho:** Tạo phiếu xuất, kiểm tra tồn kho.
    *   Theo dõi tồn kho theo thời gian thực.

*   **Quản lý Đối tác (Partner Management):**
    *   Quản lý thông tin Nhà cung cấp (Suppliers).
    *   Quản lý thông tin Khách hàng (Customers).

*   **Quản lý Nhân viên & Phân quyền (Employee & Role Management):**
    *   Quản lý danh sách nhân viên.
    *   Phân quyền chi tiết theo vai trò: Admin, Quản lý kho, Nhân viên bán hàng, Kế toán.

*   **Thống kê & Báo cáo (Statistics & Reporting):**
    *   Biểu đồ doanh thu, lợi nhuận (sử dụng ApexCharts).
    *   Thống kê hàng nhập, hàng xuất.
    *   Xuất báo cáo ra file Excel.

*   **Tiện ích khác:**
    *   Quét mã vạch (Barcode Scanning).
    *   Đăng nhập/Đăng xuất bảo mật.

## 3. Công nghệ sử dụng (Technology Stack)

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MySQL (sử dụng `mysql2`)
*   **Authentication:** JWT (JSON Web Token), Bcrypt (Password Hashing)
*   **File Upload:** Multer

### Frontend
*   **Framework:** ReactJS (Create React App)
*   **UI Library:** React Bootstrap, Bootstrap 5
*   **Charts:** ApexCharts, React-ApexCharts
*   **Routing:** React Router DOM
*   **Utilities:**
    *   Barcode Reader: `dynamsoft-barcode-reader-bundle`
    *   Excel: `xlsx`, `file-saver`

### Tools
*   **Quản lý tác vụ:** Concurrently (chạy song song client/server)
*   **Hot Reload:** Nodemon

## 4. Hướng dẫn cài đặt và chạy dự án

### Yêu cầu tiên quyết
*   Node.js đã được cài đặt.
*   MySQL Server đã được cài đặt và đang chạy.
*   Git.

### Các bước cài đặt

**Bước 1: Clone dự án**
Mở terminal tại thư mục muốn lưu dự án và chạy:
```bash
git clone link dự án nếu có.
```

**Bước 2: Cài đặt Database**
1.  Mở MySQL Workbench hoặc công cụ quản lý DB bất kỳ.
2.  Mở tệp `database/production.sql` trong thư mục dự án.
3.  Chạy toàn bộ script để tạo database và dữ liệu mẫu.

**Bước 3: Cài đặt Dependencies**
Tại thư mục gốc của dự án, chạy lệnh sau để tự động cài đặt các gói thư viện cho cả server và client:
```bash
npm run init_project
```
*Lệnh này sẽ chạy `npm install` ở thư mục gốc, thư mục `server` và thư mục `web_client`.*

**Bước 4: Cấu hình môi trường (Nếu cần)**
*   Kiểm tra file cấu hình trong `server` (thường là `.env` hoặc trong code kết nối DB) để đảm bảo thông tin đăng nhập MySQL (host, user, password) trùng khớp với máy của bạn.

**Bước 5: Khởi chạy dự án**
Tại thư mục gốc, chạy lệnh:
```bash
npm start
```
Lệnh này sẽ khởi động cả Backend (cổng 3002) và Frontend (cổng 3000).

## 5. Thông tin đăng nhập Demo

**Tài khoản 1 - Admin (Nguyễn Thị Mai)**
*   📧 Email: `maitn@company.com`
*   🔒 Password: `123456`
*   👤 Vai trò: Quản trị viên (Full quyền)

**Tài khoản 2 - Quản lý kho (Trần Văn Nam)**
*   📧 Email: `namtv@company.com`
*   🔒 Password: `123456`
*   👤 Vai trò: Quản lý kho

**Tài khoản 3 - Nhân viên bán hàng (Lê Thị Hoa)**
*   📧 Email: `hoalt@company.com`
*   🔒 Password: `123456`
*   👤 Vai trò: Nhân viên bán hàng

**Tài khoản 4 - Kế toán (Phạm Văn Tuấn)**
*   📧 Email: `tuanpv@company.com`
*   🔒 Password: `123456`
*   👤 Vai trò: Kế toán

**Tài khoản 5 - Quản lý kho (Hoàng Thị Lan)**
*   📧 Email: `lanht@company.com`
*   🔒 Password: `123456`
*   👤 Vai trò: Quản lý kho