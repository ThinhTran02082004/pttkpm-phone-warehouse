DROP DATABASE IF EXISTS ptpm_sanPham;
CREATE DATABASE ptpm_sanPham;
USE ptpm_sanPham;

DROP TABLE IF EXISTS xuatXu;
CREATE TABLE xuatXu
(
    maXuatXu  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenXuatXu VARCHAR(255) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS heDieuHanh;
CREATE TABLE heDieuHanh
(
    maHeDieuHanh  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenHeDieuHanh VARCHAR(255) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS thuongHieu;
CREATE TABLE thuongHieu
(
    maThuongHieu  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenThuongHieu VARCHAR(255) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS Rom;
CREATE TABLE Rom
(
    maRom        INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dungLuongRom INT UNSIGNED UNIQUE NOT NULL
);

DROP TABLE IF EXISTS Ram;
CREATE TABLE Ram
(
    maRam        INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dungLuongRam INT UNSIGNED UNIQUE NOT NULL
);

DROP TABLE IF EXISTS mauSac;
CREATE TABLE mauSac
(
    maMauSac  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenMauSac VARCHAR(255) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS danhMucSanPham;
CREATE TABLE danhMucSanPham
(
    maDanhMucSanPham   INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tenDanhMucSanPham  VARCHAR(255) NOT NULL,
    chipXuLy           VARCHAR(255) NOT NULL,
    dungLuongPin       INT UNSIGNED NOT NULL,
    kichThuongManHinh  INT UNSIGNED NOT NULL,
    cameraTruoc        INT UNSIGNED NOT NULL,
    cameraSau          INT UNSIGNED NOT NULL,
    phienBanHeDieuHanh VARCHAR(255) NOT NULL,
    thoiGianBaoHanh    INT UNSIGNED NOT NULL,
    hinhAnh            VARCHAR(255),

    xuatXu             INT UNSIGNED,
    heDieuHanh         INT UNSIGNED,
    thuongHieu         INT UNSIGNED,

    FOREIGN KEY (xuatXu) REFERENCES xuatXu (maXuatXu)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (heDieuHanh) REFERENCES heDieuHanh (maHeDieuHanh)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (thuongHieu) REFERENCES thuongHieu (maThuongHieu)
        ON DELETE SET NULL ON UPDATE CASCADE
);



DROP TABLE IF EXISTS cauHinh;
CREATE TABLE cauHinh
(
    maCauHinh      INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    giaNhap        INT UNSIGNED NOT NULL,
    giaXuat        INT UNSIGNED NOT NULL,

    danhMucSanPham INT UNSIGNED NOT NULL,
    ram            INT UNSIGNED NOT NULL,
    rom            INT UNSIGNED NOT NULL,
    mauSac         INT UNSIGNED NOT NULL,

    FOREIGN KEY (danhMucSanPham) REFERENCES danhMucSanPham (maDanhMucSanPham)
        ON UPDATE CASCADE ON DELETE CASCADE,

    FOREIGN KEY (ram) REFERENCES Ram (maRam)
        ON UPDATE CASCADE ON DELETE CASCADE,

    FOREIGN KEY (rom) REFERENCES Rom (maRom)
        ON UPDATE CASCADE ON DELETE CASCADE,

    FOREIGN KEY (mauSac) REFERENCES mauSac (maMauSac)
        ON UPDATE CASCADE ON DELETE CASCADE
);

# Khoi tao gia tri cho bang xuat xu
INSERT INTO xuatXu (tenXuatXu)
VALUES ('Trung Quốc'),
       ('Canada'),
       ('Mỹ'),
       ('Đài Loan');

# Khoi tao gia tri cho bang he dieu hanh
INSERT INTO heDieuHanh (tenHeDieuHanh)
VALUES ('Window'),
       ('IOS'),
       ('Android');

# Khoi tao gia tri cho bang thuong hieu
INSERT INTO thuongHieu (tenThuongHieu)
VALUES ('Microsoft'),
       ('Apple'),
       ('Google');


INSERT INTO ram (dungLuongRam)
VALUES (4),
       (2),
       (8);

INSERT INTO rom (dungLuongRom)
VALUES (4),
       (2),
       (8);

INSERT INTO mausac (tenMauSac)
VALUES ('đỏ'),
       ('xanh lá cây'),
       ('vàng');


SELECT COUNT(*) FROM danhMucSanPham;

SELECT COUNT(*) FROM cauhinh;

SELECT COUNT(*) FROM ram;
SELECT COUNT(*) FROM rom;
SELECT COUNT(*) FROM mauSac;
SELECT COUNT(*) FROM thuongHieu;
SELECT COUNT(*) FROM heDieuHanh;
SELECT COUNT(*) FROM xuatXu;