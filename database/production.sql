DROP DATABASE IF EXISTS ptpm;
CREATE DATABASE ptpm;
USE ptpm;

SHOW TABLES;

# Khoi tao doi tac
DROP TABLE IF EXISTS khachhang;
CREATE TABLE khachhang
(
    makhachhang  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenkhachhang VARCHAR(255)        NOT NULL,
    ngaysinh     DATE                NOT NULL,
    diachi       VARCHAR(255)        NOT NULL,
    sodienthoai  VARCHAR(255) UNIQUE NOT NULL,
    mail         VARCHAR(255) UNIQUE NOT NULL,
    ngaythamgia  DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS nhacungcap;
CREATE TABLE nhacungcap
(
    manhacungcap  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tennhacungcap VARCHAR(255)        NOT NULL,
    diachi        VARCHAR(255)        NOT NULL,
    mail          VARCHAR(255) UNIQUE NOT NULL,
    sodienthoai   VARCHAR(255) UNIQUE NOT NULL
);

# Khoi tao tai khoan
DROP TABLE IF EXISTS chucnang;
CREATE TABLE chucnang
(
    machucnang  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenchucnang VARCHAR(255) UNIQUE,
    tenhienthi  VARCHAR(255)
);

DROP TABLE IF EXISTS hanhdong;
CREATE TABLE hanhdong
(
    mahanhdong  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenhanhdong VARCHAR(255) UNIQUE,
    tenhienthi  VARCHAR(255)
);

DROP TABLE IF EXISTS quyenhan;
CREATE TABLE quyenhan
(
    maquyenhan INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    chucnang   INT UNSIGNED NOT NULL,
    hanhdong   INT UNSIGNED NOT NULL,

    UNIQUE (chucnang, hanhdong),

    FOREIGN KEY (chucnang) REFERENCES chucnang (machucnang)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (hanhdong) REFERENCES hanhdong (mahanhdong)
        ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS nhomquyen;
CREATE TABLE nhomquyen
(
    manhomquyen  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tennhomquyen VARCHAR(255) UNIQUE,
    tenhienthi   VARCHAR(255) UNIQUE,

    ghichu       VARCHAR(255)
);

DROP TABLE IF EXISTS ctquyen;
CREATE TABLE ctquyen
(
    mactquyen INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nhomquyen INT UNSIGNED NOT NULL,
    quyenhan  INT UNSIGNED NOT NULL,

    UNIQUE (nhomquyen, quyenhan),

    FOREIGN KEY (nhomquyen) REFERENCES nhomquyen (manhomquyen)
        ON DELETE CASCADE ON UPDATE CASCADE,

    FOREIGN KEY (quyenhan) REFERENCES quyenhan (maquyenhan)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS nhanvien;
CREATE TABLE nhanvien
(
    manhanvien  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    hoten       VARCHAR(255) NOT NULL,
    ngaysinh    DATE,
    mail        VARCHAR(255) NOT NULL UNIQUE,
    sodienthoai VARCHAR(255),
    gioitinh    ENUM ('Nam', 'Nữ') DEFAULT 'Nam'
);

DROP TABLE IF EXISTS taikhoan;
CREATE TABLE taikhoan
(
    mataikhoan INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    matkhau    VARCHAR(255)        NOT NULL,
    vaitro     INT UNSIGNED,
    nhanvien   INT UNSIGNED UNIQUE NOT NULL,

    FOREIGN KEY (vaitro) REFERENCES nhomquyen (manhomquyen)
        ON UPDATE CASCADE ON DELETE SET NULL,

    FOREIGN KEY (nhanvien) REFERENCES nhanvien (manhanvien)
        ON UPDATE CASCADE ON DELETE CASCADE
);

# Them gia tri chuc nang
INSERT INTO chucnang (tenchucnang, tenhienthi)
VALUES ('QuanLySanPham', 'Quản lý sản phẩm'),
       ('QuanLyThuocTinh', 'Quản lý thuộc tính'),
       ('QuanLyNhapKho', 'Quản lý nhập kho'),
       ('QuanLyXuatKho', 'Quản lý xuất kho'),
       ('QuanLyDichVu', 'Quản lý dịch vụ'),
       ('QuanLyKhachHang', 'Quản lý khách hàng'),
       ('QuanLyNhaCungCap', 'Quản lý Nhà cung cấp'),
       ('ThongKe', 'Thống kê'),
       ('QuanLyNhanVien', 'Quản lý nhân viên'),
       ('QuanLyTaiKhoan', 'Quản lý tài khoản'),
       ('QuanLyNhomQuyen', 'Quản lý nhóm quyền'),
       ('QuanLyQuyenHan', 'Quản lý quyền hạn');

# Them gia tri hanh dong
INSERT INTO hanhdong (tenhanhdong, tenhienthi)
VALUES ('Xem', 'Xem'),
       ('Them', 'Thêm'),
       ('Sua', 'Sửa'),
       ('Xoa', 'Xóa'),
       ('NhapFile', 'Nhập tệp'),
       ('XuatFile', 'Xuất tệp');

SELECT *
FROM hanhdong;

SELECT *
FROM chucnang;


INSERT INTO quyenhan (chucnang, hanhdong)
SELECT c.machucnang, h.mahanhdong
FROM chucnang c,
     hanhdong h
ORDER BY c.machucnang, h.mahanhdong;

INSERT INTO nhomquyen (tennhomquyen, tenhienthi, ghichu)
VALUES ('root', 'Quản trị viên', 'Toàn quyền hệ thống'),
       ('QuanLyKho', 'Quản lý kho', 'Quản lý nhập xuất kho'),
       ('NhanVienBanHang', 'Nhân viên bán hàng', 'Bán hàng và xuất kho'),
       ('KeToan', 'Kế toán', 'Xem thống kê và báo cáo');

INSERT INTO ctquyen (nhomquyen, quyenhan)
SELECT n.manhomquyen, q.maquyenhan
FROM nhomquyen n,
     quyenhan q
WHERE n.manhomquyen = 1;

# Khoi tao san pham
DROP TABLE IF EXISTS xuatxu;
CREATE TABLE xuatxu
(
    maxuatxu  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenxuatxu VARCHAR(255) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS hedieuhanh;
CREATE TABLE hedieuhanh
(
    mahedieuhanh  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenhedieuhanh VARCHAR(255) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS thuonghieu;
CREATE TABLE thuonghieu
(
    mathuonghieu  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenthuonghieu VARCHAR(255) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS rom;
CREATE TABLE rom
(
    marom        INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dungluongrom INT UNSIGNED UNIQUE NOT NULL
);

DROP TABLE IF EXISTS ram;
CREATE TABLE ram
(
    maram        INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dungluongram INT UNSIGNED UNIQUE NOT NULL
);

DROP TABLE IF EXISTS mausac;
CREATE TABLE mausac
(
    mamausac  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenmausac VARCHAR(255) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS danhmucsanpham;
CREATE TABLE danhmucsanpham
(
    madanhmucsanpham   INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tendanhmucsanpham  VARCHAR(255) NOT NULL,
    chipxuly           VARCHAR(255) NOT NULL,
    dungluongpin       INT UNSIGNED NOT NULL,
    kichthuongmanhinh  INT UNSIGNED NOT NULL,
    cameratruoc        INT UNSIGNED NOT NULL,
    camerasau          INT UNSIGNED NOT NULL,
    phienbanhedieuhanh VARCHAR(255) NOT NULL,
    thoigianbaohanh    INT UNSIGNED NOT NULL,
    hinhanh            VARCHAR(255),

    xuatxu             INT UNSIGNED,
    hedieuhanh         INT UNSIGNED,
    thuonghieu         INT UNSIGNED,

    FOREIGN KEY (xuatxu) REFERENCES xuatxu (maxuatxu)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (hedieuhanh) REFERENCES hedieuhanh (mahedieuhanh)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (thuonghieu) REFERENCES thuonghieu (mathuonghieu)
        ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS cauhinh;
CREATE TABLE cauhinh
(
    macauhinh      INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    gianhap        INT UNSIGNED NOT NULL,
    giaxuat        INT UNSIGNED NOT NULL,

    danhmucsanpham INT UNSIGNED NOT NULL,
    ram            INT UNSIGNED NOT NULL,
    rom            INT UNSIGNED NOT NULL,
    mausac         INT UNSIGNED NOT NULL,

    UNIQUE (danhmucsanpham, ram, rom, mausac),

    FOREIGN KEY (danhmucsanpham) REFERENCES danhmucsanpham (madanhmucsanpham)
        ON UPDATE CASCADE ON DELETE CASCADE,

    FOREIGN KEY (ram) REFERENCES ram (maram)
        ON UPDATE CASCADE ON DELETE CASCADE,

    FOREIGN KEY (rom) REFERENCES rom (marom)
        ON UPDATE CASCADE ON DELETE CASCADE,

    FOREIGN KEY (mausac) REFERENCES mausac (mamausac)
        ON UPDATE CASCADE ON DELETE CASCADE
);

# Khoi tao nhap xuat
DROP TABLE IF EXISTS tinhtrang;
CREATE TABLE tinhtrang
(
    matinhtrang  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tentinhtrang VARCHAR(255) UNIQUE,
    tenhienthi   VARCHAR(255)
);

DROP TABLE IF EXISTS phieudoitra;
CREATE TABLE phieudoitra
(
    maphieudoitra  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    thoigiandoitra DATETIME DEFAULT CURRENT_TIMESTAMP,
    khachhang      INT UNSIGNED,
    nhanviencskh   INT UNSIGNED,
    ghichu         TEXT,

    FOREIGN KEY (khachhang) REFERENCES khachhang (makhachhang)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (nhanviencskh) REFERENCES nhanvien (manhanvien)
        ON UPDATE CASCADE ON DELETE SET NULL
);

DROP TABLE IF EXISTS phieunhapkho;
CREATE TABLE phieunhapkho
(
    maphieunhap  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    thoigiannhap DATETIME DEFAULT CURRENT_TIMESTAMP,
    nhacungcap   INT UNSIGNED,
    nhanviennhap INT UNSIGNED,

    FOREIGN KEY (nhacungcap) REFERENCES nhacungcap (manhacungcap)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (nhanviennhap) REFERENCES nhanvien (manhanvien)
        ON UPDATE CASCADE ON DELETE SET NULL
);

DROP TABLE IF EXISTS phieuxuatkho;
CREATE TABLE phieuxuatkho
(
    maphieuxuat  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    thoigianxuat DATETIME DEFAULT CURRENT_TIMESTAMP,
    khachhang    INT UNSIGNED,
    nhanvienxuat INT UNSIGNED,

    FOREIGN KEY (khachhang) REFERENCES khachhang (makhachhang)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (nhanvienxuat) REFERENCES nhanvien (manhanvien)
        ON UPDATE CASCADE ON DELETE SET NULL
);

DROP TABLE IF EXISTS sanpham;
CREATE TABLE sanpham
(
    masanpham   INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    maimei      VARCHAR(255) UNIQUE NOT NULL,
    cauhinh     INT UNSIGNED        NOT NULL,
    phieunhap   INT UNSIGNED        NOT NULL,
    phieuxuat   INT UNSIGNED                 DEFAULT NULL,
    phieudoitra INT UNSIGNED                 DEFAULT NULL,
    tinhtrang   INT UNSIGNED        NOT NULL DEFAULT 5,

    FOREIGN KEY (cauhinh) REFERENCES cauhinh (macauhinh)
        ON UPDATE CASCADE ON DELETE CASCADE,

    FOREIGN KEY (phieunhap) REFERENCES phieunhapkho (maphieunhap)
        ON UPDATE CASCADE ON DELETE CASCADE,

    FOREIGN KEY (phieuxuat) REFERENCES phieuxuatkho (maphieuxuat)
        ON UPDATE CASCADE ON DELETE SET NULL,

    FOREIGN KEY (phieudoitra) REFERENCES phieudoitra (maphieudoitra)
        ON UPDATE CASCADE ON DELETE SET NULL,

    FOREIGN KEY (tinhtrang) REFERENCES tinhtrang (matinhtrang)
        ON UPDATE CASCADE
);

INSERT INTO tinhtrang (tentinhtrang, tenhienthi)
VALUES ('tonKho', 'tồn kho'),
       ('daBan', 'đã bán'),
       ('hoanTra', 'hoàn trả'),
       ('biDoi', 'bị đổi'),
       ('koTinhTrang', '');

SELECT * FROM tinhtrang;

# Them du lieu mau cho doi tac
INSERT INTO nhacungcap (tennhacungcap, diachi, mail, sodienthoai)
VALUES ('Apple Việt Nam', '123 Đường Lê Lợi, Quận 1, TP.HCM', 'apple@vietnam.com', '0901234567'),
       ('Samsung Việt Nam', '456 Đường Nguyễn Huệ, Quận 1, TP.HCM', 'samsung@vietnam.com', '0901234568'),
       ('Xiaomi Store', '789 Đường Trần Hưng Đạo, Quận 5, TP.HCM', 'xiaomi@store.vn', '0901234569'),
       ('Oppo Official', '321 Đường Pasteur, Quận 3, TP.HCM', 'oppo@official.vn', '0901234570'),
       ('Vivo Việt Nam', '654 Đường Lý Tự Trọng, Quận 1, TP.HCM', 'vivo@vietnam.com', '0901234571');

INSERT INTO khachhang (tenkhachhang, ngaysinh, diachi, sodienthoai, mail)
VALUES ('Nguyễn Văn A', '1990-05-15', '123 Lê Văn Việt, Quận 9, TP.HCM', '0987654321', 'nguyenvana@gmail.com'),
       ('Trần Thị B', '1995-08-20', '456 Võ Văn Ngân, Thủ Đức, TP.HCM', '0987654322', 'tranthib@gmail.com'),
       ('Lê Văn C', '1988-03-10', '789 Nguyễn Văn Bảo, Gò Vấp, TP.HCM', '0987654323', 'levanc@gmail.com'),
       ('Phạm Thị D', '1992-12-25', '321 Phan Văn Trị, Bình Thạnh, TP.HCM', '0987654324', 'phamthid@gmail.com'),
       ('Hoàng Văn E', '1985-07-30', '654 Cách Mạng Tháng 8, Quận 10, TP.HCM', '0987654325', 'hoangvane@gmail.com');

# Them du lieu mau cho nhan vien va tai khoan
INSERT INTO nhanvien (hoten, ngaysinh, mail, sodienthoai, gioitinh)
VALUES ('Nguyễn Thị Mai', '1993-04-15', 'maitn@company.com', '0912345678', 'Nữ'),
       ('Trần Văn Nam', '1991-06-20', 'namtv@company.com', '0912345679', 'Nam'),
       ('Lê Thị Hoa', '1994-09-10', 'hoalt@company.com', '0912345680', 'Nữ'),
       ('Phạm Văn Tuấn', '1990-11-05', 'tuanpv@company.com', '0912345681', 'Nam'),
       ('Hoàng Thị Lan', '1992-02-28', 'lanht@company.com', '0912345682', 'Nữ');

INSERT INTO taikhoan (matkhau, vaitro, nhanvien)
VALUES ('$2b$10$8NH6H4fHtwUvPOXGYUyv3eQodLo.tLnxRY8REUX62XRardgUWuN1K', 1, 1),  -- Admin, pass: 123456
       ('$2b$10$8NH6H4fHtwUvPOXGYUyv3eQodLo.tLnxRY8REUX62XRardgUWuN1K', 2, 2),  -- Quản lý kho, pass: 123456
       ('$2b$10$8NH6H4fHtwUvPOXGYUyv3eQodLo.tLnxRY8REUX62XRardgUWuN1K', 3, 3),  -- Nhân viên bán hàng, pass: 123456
       ('$2b$10$8NH6H4fHtwUvPOXGYUyv3eQodLo.tLnxRY8REUX62XRardgUWuN1K', 4, 4),  -- Kế toán, pass: 123456
       ('$2b$10$8NH6H4fHtwUvPOXGYUyv3eQodLo.tLnxRY8REUX62XRardgUWuN1K', 2, 5);  -- Quản lý kho, pass: 123456

# Them du lieu mau cho phieu doi tra (sau khi co khach hang va nhan vien)
INSERT INTO phieudoitra (thoigiandoitra, khachhang, nhanviencskh, ghichu)
VALUES 
('2026-03-15 10:30:00', 1, 3, 'Sản phẩm lỗi màn hình'),
('2026-04-05 14:20:00', 2, 3, 'Khách hàng muốn đổi màu'),
('2026-04-20 09:15:00', 3, 3, 'Pin chai, yêu cầu đổi mới');

# Them du lieu mau cho thuoc tinh san pham
INSERT INTO xuatxu (tenxuatxu)
VALUES ('Trung Quốc'),
       ('Việt Nam'),
       ('Hàn Quốc'),
       ('Mỹ'),
       ('Thái Lan');

INSERT INTO hedieuhanh (tenhedieuhanh)
VALUES ('Android'),
       ('iOS'),
       ('HarmonyOS');

INSERT INTO thuonghieu (tenthuonghieu)
VALUES ('Apple'),
       ('Samsung'),
       ('Xiaomi'),
       ('Oppo'),
       ('Vivo'),
       ('Realme'),
       ('Nokia');

INSERT INTO rom (dungluongrom)
VALUES (64),
       (128),
       (256),
       (512),
       (1024);

INSERT INTO ram (dungluongram)
VALUES (4),
       (6),
       (8),
       (12),
       (16);

INSERT INTO mausac (tenmausac)
VALUES ('Đen'),
       ('Trắng'),
       ('Xanh'),
       ('Đỏ'),
       ('Vàng'),
       ('Tím'),
       ('Hồng'),
       ('Xám');

# Them du lieu mau cho danh muc san pham
INSERT INTO danhmucsanpham (tendanhmucsanpham, chipxuly, dungluongpin, kichthuongmanhinh, cameratruoc, camerasau, phienbanhedieuhanh, thoigianbaohanh, hinhanh, xuatxu, hedieuhanh, thuonghieu)
VALUES 
('iPhone 14 Pro Max', 'A16 Bionic', 4323, 67, 12, 48, 'iOS 16', 12, 'iphone14promax.jpg', 1, 2, 1),
('iPhone 13', 'A15 Bionic', 3240, 61, 12, 12, 'iOS 15', 12, 'iphone13.jpg', 1, 2, 1),
('Samsung Galaxy S23 Ultra', 'Snapdragon 8 Gen 2', 5000, 68, 12, 200, 'Android 13', 12, 'galaxys23ultra.jpg', 3, 1, 2),
('Samsung Galaxy A54', 'Exynos 1380', 5000, 64, 32, 50, 'Android 13', 12, 'galaxya54.jpg', 2, 1, 2),
('Xiaomi 13 Pro', 'Snapdragon 8 Gen 2', 4820, 67, 32, 50, 'Android 13', 12, 'xiaomi13pro.jpg', 1, 1, 3),
('Xiaomi Redmi Note 12', 'Snapdragon 685', 5000, 65, 13, 48, 'Android 12', 12, 'redminote12.jpg', 1, 1, 3),
('Oppo Reno 8 Pro', 'MediaTek Dimensity 8100', 4500, 65, 32, 50, 'Android 12', 12, 'opporeno8pro.jpg', 1, 1, 4),
('Oppo A77s', 'Snapdragon 680', 5000, 65, 8, 50, 'Android 12', 12, 'oppoa77s.jpg', 1, 1, 4),
('Vivo V27', 'MediaTek Dimensity 7200', 4600, 65, 50, 50, 'Android 13', 12, 'vivov27.jpg', 1, 1, 5),
('Vivo Y36', 'Snapdragon 680', 5000, 66, 16, 50, 'Android 13', 12, 'vivoy36.jpg', 1, 1, 5);

# Them du lieu mau cho cau hinh
INSERT INTO cauhinh (gianhap, giaxuat, danhmucsanpham, ram, rom, mausac)
VALUES 
-- iPhone 14 Pro Max
(25000000, 29990000, 1, 3, 3, 1), -- 8GB/256GB Đen
(25000000, 29990000, 1, 3, 3, 2), -- 8GB/256GB Trắng
(28000000, 32990000, 1, 3, 4, 5), -- 8GB/512GB Vàng
(30000000, 35990000, 1, 3, 5, 6), -- 8GB/1TB Tím

-- iPhone 13
(15000000, 17990000, 2, 2, 2, 1), -- 6GB/128GB Đen
(15000000, 17990000, 2, 2, 2, 7), -- 6GB/128GB Hồng
(17000000, 19990000, 2, 2, 3, 3), -- 6GB/256GB Xanh

-- Samsung Galaxy S23 Ultra
(22000000, 26990000, 3, 4, 3, 1), -- 12GB/256GB Đen
(24000000, 28990000, 3, 4, 4, 2), -- 12GB/512GB Trắng

-- Samsung Galaxy A54
(8000000, 9990000, 4, 3, 2, 3), -- 8GB/128GB Xanh
(9000000, 10990000, 4, 3, 3, 1), -- 8GB/256GB Đen

-- Xiaomi 13 Pro
(18000000, 21990000, 5, 4, 3, 1), -- 12GB/256GB Đen
(20000000, 23990000, 5, 4, 4, 2), -- 12GB/512GB Trắng

-- Xiaomi Redmi Note 12
(5000000, 5990000, 6, 3, 2, 3), -- 8GB/128GB Xanh
(5500000, 6490000, 6, 3, 3, 1), -- 8GB/256GB Đen

-- Oppo Reno 8 Pro
(12000000, 14990000, 7, 3, 3, 1), -- 8GB/256GB Đen
(12000000, 14990000, 7, 3, 3, 5), -- 8GB/256GB Vàng

-- Oppo A77s
(5000000, 5990000, 8, 3, 2, 3), -- 8GB/128GB Xanh

-- Vivo V27
(10000000, 11990000, 9, 3, 2, 5), -- 8GB/128GB Vàng
(11000000, 12990000, 9, 3, 3, 6), -- 8GB/256GB Tím

-- Vivo Y36
(4500000, 5490000, 10, 3, 2, 1); -- 8GB/128GB Đen

# Them du lieu mau cho phieu nhap kho
INSERT INTO phieunhapkho (thoigiannhap, nhacungcap, nhanviennhap)
VALUES 
('2026-01-15 08:30:00', 1, 1),
('2026-01-20 09:15:00', 2, 2),
('2026-02-05 10:00:00', 3, 3),
('2026-02-18 14:30:00', 4, 1),
('2026-03-10 11:20:00', 5, 2),
('2026-03-25 15:45:00', 1, 3),
('2026-04-08 08:00:00', 2, 1),
('2026-04-22 13:30:00', 3, 2);

# Them du lieu mau cho phieu xuat kho
INSERT INTO phieuxuatkho (thoigianxuat, khachhang, nhanvienxuat)
VALUES 
('2026-02-01 10:30:00', 1, 1),
('2026-02-15 14:20:00', 2, 2),
('2026-03-05 09:45:00', 3, 3),
('2026-03-20 16:10:00', 4, 1),
('2026-04-10 11:30:00', 5, 2);

# Them du lieu mau cho san pham
INSERT INTO sanpham (maimei, cauhinh, phieunhap, phieuxuat, phieudoitra, tinhtrang)
VALUES 
-- Phieu nhap 1 - iPhone 14 Pro Max
('353123456789001', 1, 1, 1, NULL, 2), -- Đen, đã bán
('353123456789002', 1, 1, NULL, NULL, 1), -- Đen, tồn kho
('353123456789003', 2, 1, NULL, NULL, 1), -- Trắng, tồn kho
('353123456789004', 3, 1, 2, NULL, 2), -- Vàng, đã bán
('353123456789005', 1, 1, 1, 1, 3), -- Đen, đã bán và đổi trả (lỗi màn hình)

-- Phieu nhap 2 - Samsung Galaxy S23 Ultra  
('352234567890001', 8, 2, NULL, NULL, 1), -- Đen, tồn kho
('352234567890002', 8, 2, 3, NULL, 2), -- Đen, đã bán
('352234567890003', 9, 2, NULL, NULL, 1), -- Trắng, tồn kho
('352234567890004', 8, 2, 2, 2, 2), -- Đen, đã bán và đổi màu

-- Phieu nhap 3 - Xiaomi Redmi Note 12
('351345678901001', 14, 3, NULL, NULL, 1), -- Xanh, tồn kho
('351345678901002', 14, 3, NULL, NULL, 1), -- Xanh, tồn kho
('351345678901003', 15, 3, 4, NULL, 2), -- Đen, đã bán
('351345678901004', 15, 3, NULL, NULL, 1), -- Đen, tồn kho
('351345678901005', 14, 3, 3, 3, 3), -- Xanh, đã bán và đổi trả (pin chai)

-- Phieu nhap 4 - Oppo Reno 8 Pro
('350456789012001', 16, 4, NULL, NULL, 1), -- Đen, tồn kho
('350456789012002', 17, 4, 5, NULL, 2), -- Vàng, đã bán

-- Phieu nhap 5 - Vivo Y36
('349567890123001', 20, 5, NULL, NULL, 1), -- Đen, tồn kho
('349567890123002', 20, 5, NULL, NULL, 1), -- Đen, tồn kho
('349567890123003', 20, 5, NULL, NULL, 1), -- Đen, tồn kho

-- Phieu nhap 6 - iPhone 13
('353678901234001', 5, 6, NULL, NULL, 1), -- Đen, tồn kho
('353678901234002', 6, 6, NULL, NULL, 1), -- Hồng, tồn kho
('353678901234003', 7, 6, NULL, NULL, 1), -- Xanh, tồn kho

-- Phieu nhap 7 - Samsung Galaxy A54
('352789012345001', 10, 7, NULL, NULL, 1), -- Xanh, tồn kho
('352789012345002', 10, 7, NULL, NULL, 1), -- Xanh, tồn kho
('352789012345003', 11, 7, NULL, NULL, 1), -- Đen, tồn kho

-- Phieu nhap 8 - Xiaomi 13 Pro
('351890123456001', 12, 8, NULL, NULL, 1), -- Đen, tồn kho
('351890123456002', 12, 8, NULL, NULL, 1), -- Đen, tồn kho
('351890123456003', 13, 8, NULL, NULL, 1); -- Trắng, tồn kho





