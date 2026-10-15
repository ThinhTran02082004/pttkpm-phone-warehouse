DROP DATABASE IF EXISTS ptpm_doitac;
CREATE DATABASE ptpm_doitac;
USE ptpm_doitac;

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

SHOW DATABASES;


SELECT COUNT(*)
FROM khachhang;
SELECT COUNT(*)
FROM nhacungcap;



SELECT *
FROM khachhang
ORDER BY ngaysinh;

SELECT *
FROM nhacungcap;