DROP DATABASE IF EXISTS ptpm_nhapXuat;
CREATE DATABASE ptpm_nhapXuat;
USE ptpm_nhapXuat;

DROP TABLE IF EXISTS tinhTrang;
CREATE TABLE tinhTrang
(
    maTinhTrang  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenTinhTrang VARCHAR(255) UNIQUE,
    tenHienThi   VARCHAR(255)
);

DROP TABLE IF EXISTS phieuNhapKho;
CREATE TABLE phieuNhapKho
(
    maPhieuNhap  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    thoiGianNhap DATE NOT NULL,
    nhaCungCap   INT UNSIGNED,
    nhanVienNhap INT UNSIGNED,

    FOREIGN KEY (nhaCungCap) REFERENCES ptpm_doiTac.nhaCungCap (maNhaCungCap)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (nhanVienNhap) REFERENCES ptpm_taikhoan.nhanvien (maNhanVien)
        ON UPDATE CASCADE ON DELETE SET NULL
);

DROP TABLE IF EXISTS phieuXuatKho;
CREATE TABLE phieuXuatKho
(
    maPhieuXuat  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    thoiGianXuat DATE NOT NULL,
    khachHang    INT UNSIGNED,
    nhanVienXuat INT UNSIGNED,

    FOREIGN KEY (khachHang) REFERENCES ptpm_doiTac.khachhang (maKhachHang)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (nhanVienXuat) REFERENCES ptpm_taikhoan.nhanvien (maNhanVien)
        ON UPDATE CASCADE ON DELETE SET NULL
);

DROP TABLE IF EXISTS phuongAnXuat;
CREATE TABLE phuongAnXuat
(
    maPhuongAnXuat INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    phuongAnDoiTra INT UNSIGNED,
    phieuSuat      INT UNSIGNED,

    FOREIGN KEY (phuongAnDoiTra) REFERENCES ptpm_doitra.phuongan (maPhuongAnDoiTra)
        ON UPDATE CASCADE ON DELETE SET NULL,

    FOREIGN KEY (phieuSuat) REFERENCES phieuXuatKho (maPhieuXuat)
        ON UPDATE CASCADE ON DELETE CASCADE
);


DROP TABLE IF EXISTS sanPham;
CREATE TABLE sanPham
(
    maSanPham    INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    maIMEI       VARCHAR(255) UNIQUE,
    cauHinh      INT UNSIGNED NOT NULL,
    phieuNhap    INT UNSIGNED NOT NULL,
    phuongAnXuat INT UNSIGNED,

    FOREIGN KEY (cauHinh) REFERENCES ptpm_sanpham.cauhinh (maCauHinh)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (phieuNhap) REFERENCES ptpm_nhapXuat.phieuNhapKho (maPhieuNhap)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (phuongAnXuat) REFERENCES phuongAnXuat (maPhuongAnXuat)
        ON UPDATE CASCADE ON DELETE SET NULL
);

SHOW DATABASES;