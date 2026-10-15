# HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN
## ĐỒ ÁN QUẢN LÝ KHO HÀNG ĐIỆN THOẠI (PTTKPM)

---

### 📌 1. YÊU CẦU MÔI TRƯỜNG

Trước khi khởi chạy hệ thống, hãy đảm bảo máy tính đã cài đặt:
1. **Node.js:** Phiên bản 18+ (khuyên dùng Node 18 hoặc 20 LTS).
2. **MySQL Server:** Thông qua **XAMPP**, **Laragon** hoặc **MySQL Service**:
   - Host: `127.0.0.1` (hoặc `localhost`)
   - Cổng (Port): `3306`
   - Tài khoản MySQL: `root`
   - Mật khẩu: để trống (mặc định của XAMPP)

---

### ⚡ 2. CÁCH CHẠY NHANH BẰNG 1-CLICK (KHUYÊN DÙNG)

Trong thư mục gốc của dự án, bạn có thể chạy trực tiếp 2 file script sau:

1. **Khởi tạo Database (chỉ cần chạy lần đầu hoặc khi muốn reset dữ liệu):**
   - Click đúp vào file [`setup-db.bat`](file:///C:/Users/trant/Downloads/pttkpm/pttkpm/setup-db.bat).
   - Hệ thống sẽ tự động tạo cơ sở dữ liệu `pttkpm_rebuild` và nạp toàn bộ dữ liệu mẫu (sản phẩm, IMEI, nhân viên, phân quyền...).

2. **Khởi động toàn bộ Hệ thống (Backend + Frontend):**
   - Click đúp vào file [`start-project.bat`](file:///C:/Users/trant/Downloads/pttkpm/pttkpm/start-project.bat).
   - Script sẽ tự động mở 2 cửa sổ chạy song song:
     * **Backend API Server:** `http://localhost:3002`
     * **Frontend Web Client:** `http://localhost:3000`
   - Trình duyệt sẽ tự động mở trang đăng nhập tại [http://localhost:3000](http://localhost:3000).

---

### 💻 3. CÁCH CHẠY THỦ CÔNG BẰNG TERMINAL (POWERSHELL / CMD)

Nếu muốn khởi động từng thành phần bằng dòng lệnh:

#### **Bước 1: Nạp Cơ sở dữ liệu**
Mở terminal tại thư mục dự án và chạy:
```powershell
# Nếu dùng XAMPP MySQL mặc định:
C:\xampp\mysql\bin\mysql.exe -u root --port=3306 < database\rebuild_schema.sql
C:\xampp\mysql\bin\mysql.exe -u root --port=3306 < database\rebuild_seed.sql
```

#### **Bước 2: Chạy Backend API (Port 3002)**
Mở một cửa sổ terminal:
```powershell
cd server
npm install
npm start
```
> Kiểm tra Backend hoạt động: truy cập [http://localhost:3002/api/health](http://localhost:3002/api/health) thấy trả về `{"success": true, "status": "ok"}`.

#### **Bước 3: Chạy Frontend React (Port 3000)**
Mở một cửa sổ terminal thứ hai:
```powershell
cd web_client
npm install
npm start
```
Trang web sẽ tự động mở tại [http://localhost:3000](http://localhost:3000).

---

### 👥 4. DANH SÁCH TÀI KHOẢN ĐĂNG NHẬP MẪU

Tất cả tài khoản trong hệ thống đều có mật khẩu mặc định là: **`123456`**

| Tên đăng nhập | Mật khẩu | Vai trò | Quyền hạn chính |
|:---|:---:|:---|:---|
| **`admin`** | `123456` | Quản trị viên | Toàn quyền hệ thống, phân quyền, quản lý nhân sự |
| **`warehouse01`** | `123456` | Quản lý kho | Nhập kho, xuất kho, kiểm kê IMEI, quản lý sản phẩm |
| **`sales01`** | `123456` | Nhân viên bán hàng | Lập phiếu xuất bán, kiểm tra tồn kho, xem khách hàng |
| **`cskh01`** | `123456` | Dịch vụ & CSKH | Tiếp nhận bảo hành, đổi trả, sửa chữa máy theo IMEI |
| **`accountant01`** | `123456` | Kế toán kho | Xem thống kê doanh thu, báo cáo tồn kho, xuất Excel |

---

### 🧪 5. CÁCH CHẠY AUTOMATION TESTING (KATALON STUDIO)

Hệ thống đã chuẩn bị sẵn **170 Test Cases tự động hoá** trong thư mục [`katalon_pttkpm`](file:///C:/Users/trant/Downloads/pttkpm/pttkpm/katalon_pttkpm):

1. **Khởi động ứng dụng web:** Chạy xong Backend (`localhost:3002`) và Frontend (`localhost:3000`) như Mục 2 hoặc Mục 3 ở trên.
2. **Mở dự án trong Katalon Studio:**
   - Mở phần mềm **Katalon Studio**.
   - Chọn menu **File > Open Project**.
   - Trỏ tới file: [`katalon_pttkpm/PTTKPM_PhoneWarehouse.prj`](file:///C:/Users/trant/Downloads/pttkpm/pttkpm/katalon_pttkpm/PTTKPM_PhoneWarehouse.prj).
3. **Thực thi kiểm thử:**
   - Tại thanh điều hướng bên trái (Tests Explorer), mở thư mục **Test Suites**.
   - Click đúp vào [`TS_Full_170_SystemSuite`](file:///C:/Users/trant/Downloads/pttkpm/pttkpm/katalon_pttkpm/Test%20Suites/TS_Full_170_SystemSuite.ts) (chạy toàn bộ 170 Test Cases) hoặc chọn các suite theo từng phân hệ (`TS_01_Auth`, `TS_05_Warehouse_Imports`,...).
   - Bấm nút **Run** (chọn trình duyệt **Chrome** hoặc **Chrome (headless)**) trên thanh công cụ.
   - Sau khi chạy xong, xem kết quả và ảnh chụp màn hình tại mục **Reports**.
