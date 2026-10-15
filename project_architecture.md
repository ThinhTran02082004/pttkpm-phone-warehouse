# Cấu trúc và Kiến trúc Dự án Quản lý Kho Điện Thoại

Dự án này là một hệ thống **Quản lý Kho Điện Thoại** (Phone Manager) dựa trên nền tảng Web, được chia thành hai phần chính: Client (Giao diện người dùng) và Server (Xử lý nghiệp vụ & Cơ sở dữ liệu).

Dưới đây là giải thích chi tiết về cấu trúc của toàn bộ dự án và tác dụng của từng thành phần.

---

## 🏗 Tổng quan Kiến trúc (Architecture Overview)
Dự án sử dụng kiến trúc **Client-Server** truyền thống:
- **Frontend (Web Client):** Xây dựng bằng luồng công nghệ **ReactJS** kết hợp với **React-Bootstrap** để hiển thị giao diện. Giao tiếp với backend qua RESTful API.
- **Backend (Server):** Xây dựng bằng **NodeJS** sử dụng framework **ExpressJS**. Xử lý toàn bộ logic nghiệp vụ, bảo mật, và tương tác với cơ sở dữ liệu.
- **Database:** Sử dụng **MySQL**. Script khởi tạo database nằm trong thư mục `database/`.

---

## 📁 Giải thích Cấu trúc Thư mục (Directory Structure)

Thư mục gốc của dự án `e:\pt-tkpm\` bao gồm các thành phần sau:

```text
pt-tkpm/
├── README.md               # File hướng dẫn chạy dự án cơ bản.
├── Report.docx / .pdf      # Báo cáo đồ án tổng quan của dự án.
├── package.json            # File cấu hình NPM gốc dùng lệnh `concurrently` để chạy đồng thời cả Frontend và Backend.
│
├── database/               # QUẢN LÝ CƠ SỞ DỮ LIỆU
│   ├── production.sql      # Script SQL chứa cấu trúc bảng (schema) và dữ liệu mẫu (mock data).
│   └── add_profile_fields.sql # Các script cập nhật/bổ sung cấu trúc bảng sau này.
│
├── server/                 # TẦNG BACKEND (NodeJS + Express)
│   ├── index.js            # Entry point của Server (cấu hình Express, CORS, Static Files, nạp các Middleware và Routes).
│   ├── package.json        # Dependencies của backend (express, mysql2, cors, jsonwebtoken, multer...).
│   ├── images/             # Nơi lưu trữ ảnh upload từ client (vd: avatar nhân viên, ảnh sản phẩm).
│   │
│   └── src/                # Mã nguồn chính của Backend
│       ├── config/         # Cấu hình kết nối Database (db.js) chứa host, username, password MySQL.
│       ├── models/         # Tầng Database Queries: Chứa các file viết câu lệnh SQL để thao tác với DB.
│       │   ├── auth.js     # Thao tác liên quan tới Đăng nhập, verify tài khoản, lấy/cập nhật Profile.
│       │   ├── products/   # Thao tác các bảng liên quan Điện thoại, Thuộc tính, Cấu hình.
│       │   ├── quanLyTaiKhoan/ # Quản lý Tài khoản, Nhân viên, Phân quyền.
│       │   └── statistics/ # Truy xuất số liệu Thống kê (Doanh thu, Tồn kho...).
│       │
│       └── routes/         # Tầng Routing (API Endpoints): Định tuyến request từ Client đến Models.
│           ├── Auth/               # API /api/auth/*: Đăng nhập, Profile, Quản lý Token (validateToken.js).
│           ├── Employees/          # API /api/employees/* & /api/roles/*
│           ├── Products/           # API /api/products/*
│           ├── Partners/           # API /api/customers/*, /api/suppliers/*
│           ├── Warehouse/          # API /api/warehouse/*, /api/returns/* (Nhập/Xuất kho)
│           └── Statistics/         # API /api/statistics/* (Thống kê)
│
└── web_client/             # TẦNG FRONTEND (ReactJS)
    ├── package.json        # Dependencies của frontend (react, react-router-dom, react-bootstrap, chart.js...).
    ├── public/             # Chứa file index.html gốc, favicon, và ảnh mặc định (default-avatar.png).
    │
    └── src/                # Mã nguồn chính của Frontend
        ├── index.js        # Entry point của React, render thẻ <App/> vào DOM.
        ├── App.js          # Chuyển hướng sang src/pages/index.js.
        ├── utilities/      # Chứa các hàm hỗ trợ chung, colors, cấu hình navLinks.
        │
        ├── api/            # Chứa các hàm call API tái sử dụng (hàm fetch) và cấu hình Context (UserContext).
        │   └── authentication.js   # File chứa `UserContext` để lưu trạng thái đăng nhập (token, user, perm) toàn cục.
        │
        ├── components/     # Chứa các Component dùng chung (UI Reusable).
        │   ├── Icons/          # Thư viện SVG icon tự vẽ dùng cho dự án nhằm đồng bộ thiết kế (Smartphone, Login, Mail...).
        │   ├── layouts/        # Chứa Layout chính của web (Page1, blockContent).
        │   │   └── sideBar/    # Component Thanh điều hướng bên trái (Navigation Menu).
        │   └── Forms/          # Các custom input forms (vd: InputShadow).
        │
        └── pages/          # Chứa các Component đặc thù của từng Trang (Pages)
            ├── index.js                # Định nghĩa toàn bộ hệ thống Routing (react-router-dom) & Kiểm tra Đăng nhập.
            ├── DoiTacPage/             # Giao diện Quản lý Khách hàng, Nhà cung cấp.
            ├── NhapXuatPage/           # Giao diện Nhập/Xuất/Đổi trả hàng.
            ├── OtherPage/              # Các trang lẻ cơ bản
            │   ├── dangNhap/           # Trang Đăng nhập.
            │   ├── dangKi/             # Trang Đăng ký (Tạo tài khoản).
            │   ├── dangSuat/           # Trang Đăng xuất.
            │   ├── trangChu/           # Trang Dashboard tổng hợp chức năng cho người dùng.
            │   └── TaiKhoanPage/       # Trang quản trị Hồ sơ cá nhân (Update avatar, thông tin).
            ├── phanQuyenPage/          # Giao diện Quản trị viên (Thiết lập role, cấp quyền tài khoản, ds Nhân viên).
            ├── SanPhamPage/            # Giao diện Quản lý Sản phẩm điện thoại, thuộc tính kỹ thuật.
            └── thongKePage/            # Giao diện Báo cáo Thống kê (Biểu đồ doanh thu, top bán chạy).
```

---

## ⚙ Giải thích Luồng Hoạt động (Data Flow)

### 1. Luồng Xác thực (Authentication)
* Khi user truy cập trang, file [web_client/src/pages/index.js](file:///e:/pt-tkpm/web_client/src/pages/index.js) sẽ kiểm tra `sessionStorage.getItem("Authorization")`. Nếu không có, user bị đẩy ra trang `/dang-nhap`.
* Ở trang Đăng nhập, React gọi POST đến `http://localhost:3002/api/auth/login` ([server/src/routes/Auth/index.js](file:///e:/pt-tkpm/server/src/routes/Auth/index.js)).
* Server kiểm tra với DB qua [models/auth.js](file:///e:/pt-tkpm/server/src/models/auth.js). Nếu đúng password, tạo ra 1 JWT Token (`validateToken.js`) và trả về json `{ token, user, ... }`.
* Client lưu token và thông tin user vào `sessionStorage` và React Context (`UserContext`). Các Request thao tác dữ liệu từ đây về sau sẽ đính URL header `Authorization: Bearer <Token>`.

### 2. Luồng bảo mật API (Authorization Middleware)
* Ở file [server/index.js](file:///e:/pt-tkpm/server/index.js), mọi API nội bộ đều đi qua middleware [parseAccountData](file:///e:/pt-tkpm/server/index.js#17-25) (đọc token), [initialDBConnection](file:///e:/pt-tkpm/server/index.js#26-38) (tạo pool DB connection) và [getPermission](file:///e:/pt-tkpm/server/index.js#39-45) (lấy danh sách các quyền của role hiện tại từ DB `getAccountPermisisonsQuery`).
* Nhờ cấu trúc này, backend sẽ khước từ các lời gọi API nếu User không có quyền thực hiện chức năng tương ứng.

### 3. Luồng Quản lý Component (UI/UX)
* Hệ thống xây dựng dựa trên Component. Layout chính của Web là Sidebar bên trái, nội dung thay đổi bên phải.
* Component Sidebar ([web_client/src/components/layouts/sideBar/index.js](file:///e:/pt-tkpm/web_client/src/components/layouts/sideBar/index.js)) sử dụng mảng Navigation (`utilities/navLinks.js`). Nó tự động nhận diện Context `perm` (Quyền hạn) để ẩn/hiện menu nếu user đó không có quyền Xem trang tương ứng (Ví dụ: Nhân viên kho sẽ không thấy menu Phân Quyền).
* Hình thu nhỏ (Avatar) sẽ lấy file động qua `http://localhost:3002/api/images/[tên.png]` dựa trên Express Static Files (multer upload).

### 4. Kết nối CSDL (MySQL Connection Pool)
* Dự án dùng thư viện `mysql2`. Tại [server/src/models/index.js](file:///e:/pt-tkpm/server/src/models/index.js), Pool Connection được khởi tạo. Để tối ưu tốc độ và không bị tràn kết nối, mỗi Request sẽ được Middleware cấp cho 1 kết nối `res.locals.conn`, sau khi query xong models và có mảng Return Data, connection sẽ được `conn.destroy()` tại lớp Routing.

---
**Tổng kết:** Dự án này là một ứng dụng SPAs (Single Page Application) tiêu chuẩn. Tách bạch hoàn toàn giữa View (React) và Controller/Model (Express/MySQL), rất thuận tiện cho việc bảo trì, custom UI, và nâng cấp tính năng độc lập sau này.
