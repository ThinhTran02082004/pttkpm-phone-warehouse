DROP DATABASE IF EXISTS ptpm_doiTra;
CREATE DATABASE ptpm_doiTra;
USE ptpm_doiTra;

DROP TABLE IF EXISTS loaiPhuongAn;
CREATE TABLE loaiPhuongAn
(
    maLoaiPhuongAn  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenLoaiPhuongAn VARCHAR(255) UNIQUE,
    tenHienThi      VARCHAR(255)
);

DROP TABLE IF EXISTS phieuDoiTra;
CREATE TABLE phieuDoiTra
(
    maPhieuDoiTra  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ngayDoiTra     DATE NOT NULL,
    nhanVienDoiTra INT UNSIGNED,

    FOREIGN KEY (nhanVienDoiTra) REFERENCES ptpm_taikhoan.nhanvien (maNhanVien)
        ON UPDATE CASCADE ON DELETE SET NULL
);

DROP TABLE IF EXISTS phuongAn;
CREATE TABLE phuongAn
(
    maPhuongAnDoiTra INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    soTienHoanTra    INT UNSIGNED,
    phieuDoiTra      INT UNSIGNED,
    loaiPhuongAn     INT UNSIGNED,

    FOREIGN KEY (phieuDoiTra) REFERENCES phieuDoiTra (maPhieuDoiTra)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (loaiPhuongAn) REFERENCES loaiPhuongAn (maLoaiPhuongAn)
        ON UPDATE CASCADE ON DELETE SET NULL
)