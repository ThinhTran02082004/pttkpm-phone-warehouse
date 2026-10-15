DROP DATABASE IF EXISTS ptpm_taikhoan;
CREATE DATABASE IF NOT EXISTS ptpm_taikhoan;
USE ptpm_taikhoan;

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
  tenhienthi   VARCHAR(255),
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
  sodienthoai VARCHAR(20) UNIQUE,
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
       ('QuanLyNhanVien', 'Quản lý nhân viên'),
       ('QuanLyTaiKhoan', 'Quản lý tài khoản'),
       ('ThongKe', 'Thống kê'),
       ('QuanLyNhomQuyen', 'Quản lý nhóm quyền'),
       ('QuanLyQuyenHan', 'Quản lý quyền hạn');

# Them gia tri hanh dong
INSERT INTO hanhdong (tenhanhdong, tenhienthi)
VALUES ('Xem', 'Xem'),
       ('XemCaNhan', 'Xem cá nhân'),
       ('XemChiTiet', 'Xem chi tiết'),
       ('Them', 'Thêm'),
       ('Sua', 'Sửa'),
       ('Xoa', 'Xóa'),
       ('NhapFile', 'Nhập tệp'),
       ('XuatFile', 'Xuất tệp');


# them quyen xem cho tat cac cac chuc nang
INSERT INTO quyenhan (chucnang, hanhdong) (SELECT c.machucnang chucnang, h.mahanhdong AS hanhdong
                                           FROM chucnang c
                                                  INNER JOIN hanhdong h
                                           WHERE h.mahanhdong = 1);

INSERT INTO quyenhan (chucnang, hanhdong) (SELECT c.machucnang, h.mahanhdong
                                           FROM chucnang c
                                                  INNER JOIN hanhdong h);

INSERT INTO ctquyen (nhomquyen, quyenhan) (SELECT 1 AS nhomquyen, quyenhan.maquyenhan quyenhan FROM quyenhan);

SELECT *
FROM ctquyen;
-- Them vai tro vao trong csdl
INSERT INTO nhomquyen (tennhomquyen, tenhienthi, ghichu)
VALUES ('root', 'Quản lý kho', ''),
       ('nhanVien', 'Nhân viên', ''),
       ('kho', 'test1', '');

DELETE
FROM ctquyen
WHERE nhomquyen IN (3, 3);


SELECT *
FROM nhanvien;
SELECT *
FROM taikhoan;

SELECT *
FROM nhomquyen;

SELECT COUNT(*)
FROM nhanvien;


SELECT COUNT(*)
FROM ptpm_doitac.khachhang;
DELETE
FROM ptpm_doitac.khachhang
WHERE makhachhang > 200;

SELECT qh.maquyenhan, cn.*, hd.*
FROM ctquyen c
       INNER JOIN quyenhan qh ON c.quyenhan = qh.maquyenhan
       INNER JOIN chucnang cn ON qh.chucnang = cn.machucnang
       INNER JOIN hanhdong hd ON qh.hanhdong = hd.mahanhdong
WHERE c.nhomquyen = 41;

SHOW DATABASES;