USE ptpm;

# Doi Tac
SELECT COUNT(*)
FROM khachhang;

SELECT COUNT(*)
FROM nhacungcap;

# San pham
SELECT COUNT(*)
FROM rom;

SELECT COUNT(*)
FROM ram;

SELECT COUNT(*)
FROM mausac;

SELECT COUNT(*)
FROM thuonghieu;

SELECT COUNT(*)
FROM xuatxu;

SELECT COUNT(*)
FROM hedieuhanh;

SELECT COUNT(*)
FROM danhmucsanpham;

SELECT COUNT(*)
FROM cauhinh;

# Tai khoan
SELECT COUNT(*)
FROM nhanvien;

SELECT COUNT(*)
FROM taikhoan;

SELECT COUNT(*)
FROM chucnang;

SELECT COUNT(*)
FROM hanhdong;

SELECT COUNT(*)
FROM nhomquyen;

SELECT COUNT(*)
FROM quyenhan;

SELECT COUNT(*)
FROM nhanvien;

SELECT COUNT(*)
FROM phieunhapkho;

SELECT COUNT(*)
FROM phieuxuatkho;

SELECT COUNT(*)
FROM sanpham;

SELECT *
FROM nhacungcap;



INSERT INTO phieunhapkho (nhacungcap, nhanviennhap)
VALUES (1, 2);

SELECT *
FROM phieuxuatkho
;

SELECT *
FROM sanpham;

SELECT *
FROM cauhinh;


SELECT COUNT(*)
FROM danhmucsanpham;

SELECT n.manhacungcap, COUNT(DISTINCT d.madanhmucsanpham) lannhap, SUM(c.gianhap) tongtien
FROM nhacungcap n
         INNER JOIN phieunhapkho p ON n.manhacungcap = p.nhacungcap
         INNER JOIN sanpham s ON p.maphieunhap = s.phieunhap
         INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
         INNER JOIN danhmucsanpham d ON c.danhmucsanpham = d.madanhmucsanpham
WHERE p.thoigiannhap BETWEEN ? AND ?
GROUP BY n.manhacungcap;


SELECT COUNT(*)
FROM (SELECT DISTINCT madanhmucsanpham, n.manhacungcap
      FROM nhacungcap n

               INNER JOIN phieunhapkho p ON n.manhacungcap = p.nhacungcap
               INNER JOIN sanpham s ON p.maphieunhap = s.phieunhap
               INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
               INNER JOIN danhmucsanpham d ON c.danhmucsanpham = d.madanhmucsanpham
      WHERE n.manhacungcap = 2) t;

SELECT SUM(c.gianhap)
FROM nhacungcap n
         INNER JOIN phieunhapkho p ON n.manhacungcap = p.nhacungcap
         INNER JOIN sanpham s ON p.maphieunhap = s.phieunhap
         INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
WHERE n.manhacungcap = 3;



SELECT k.makhachhang, k.tenkhachhang, COUNT(DISTINCT p.maphieuxuat) muahang, SUM(c.giaxuat) tongtien
FROM khachhang k
         INNER JOIN phieuxuatkho p ON k.makhachhang = p.khachhang
         INNER JOIN sanpham s ON p.maphieuxuat = s.phieuxuat
         INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
WHERE p.thoigianxuat BETWEEN ? AND ?
GROUP BY k.makhachhang


SELECT d.madanhmucsanpham, d.tendanhmucsanpham
FROM danhmucsanpham d
         INNER JOIN cauhinh c ON d.madanhmucsanpham = c.danhmucsanpham
         INNER JOIN sanpham s ON c.macauhinh = s.cauhinh
         INNER JOIN phieuxuatkho x ON s.phieuxuat = x.maphieuxuat
         INNER JOIN phieunhapkho n ON s.phieunhap = n.maphieunhap
GROUP BY d.madanhmucsanpham;


SELECT YEAR(x.thoigianxuat)              nam,
       SUM(c1.gianhap)                   von,
       SUM(c2.giaxuat)                   doanhthu,
       SUM(c2.giaxuat) - SUM(c1.gianhap) loinhuan
FROM phieuxuatkho x
         CROSS JOIN phieunhapkho n ON YEAR(x.thoigianxuat) = YEAR(n.thoigiannhap)
         INNER JOIN sanpham s1 ON n.maphieunhap = s1.phieunhap
         INNER JOIN cauhinh c1 ON s1.cauhinh = c1.macauhinh

         INNER JOIN sanpham s2 ON x.maphieuxuat = s2.phieuxuat
         INNER JOIN cauhinh c2 ON s2.cauhinh = c2.macauhinh
GROUP BY nam;



SELECT YEAR(p.thoigiannhap) nam, SUM(c.gianhap) von
FROM phieunhapkho p
         INNER JOIN sanpham s ON p.maphieunhap = s.phieunhap
         INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
GROUP BY nam;


SELECT YEAR(x.thoigianxuat) nam, SUM(c.giaxuat) doanhthu
FROM phieuxuatkho x
         INNER JOIN sanpham s ON x.maphieuxuat = s.phieunhap
         INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
GROUP BY nam;

SELECT a.nam, a.von, b.doanhthu, b.doanhthu - a.von loinhuan
FROM (SELECT YEAR(p.thoigiannhap) nam, SUM(c.gianhap) von
      FROM phieunhapkho p
               INNER JOIN sanpham s ON p.maphieunhap = s.phieunhap
               INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
      GROUP BY nam) a
         INNER JOIN (SELECT YEAR(x.thoigianxuat) nam, SUM(c.giaxuat) doanhthu
                     FROM phieuxuatkho x
                              INNER JOIN sanpham s ON x.maphieuxuat = s.phieunhap
                              INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
                     GROUP BY nam) b ON a.nam = b.nam;


SELECT MONTH(a.thoigian) thang, SUM(a.von) von, SUM(b.doanhthu) doanhthu, SUM(doanhthu - von) loinhuan
FROM (SELECT p.thoigiannhap thoigian, SUM(c.gianhap) von
      FROM phieunhapkho p
               INNER JOIN sanpham s ON p.maphieunhap = s.phieunhap
               INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
      GROUP BY p.thoigiannhap) a,
     (SELECT x.thoigianxuat thoigian, SUM(c.giaxuat) doanhthu
      FROM phieuxuatkho x
               INNER JOIN sanpham s ON x.maphieuxuat = s.phieunhap
               INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
      GROUP BY x.thoigianxuat) b
WHERE a.thoigian = b.thoigian
  AND YEAR(a.thoigian) = ?
GROUP BY thang
ORDER BY thang;

SELECT a.thoigian, SUM(a.von) von, SUM(b.doanhthu) doanhthu, SUM(doanhthu - von) loinhuan
FROM (SELECT p.thoigiannhap thoigian, SUM(c.gianhap) von
      FROM phieunhapkho p
               INNER JOIN sanpham s ON p.maphieunhap = s.phieunhap
               INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
      GROUP BY p.thoigiannhap) a,
     (SELECT x.thoigianxuat thoigian, SUM(c.giaxuat) doanhthu
      FROM phieuxuatkho x
               INNER JOIN sanpham s ON x.maphieuxuat = s.phieunhap
               INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
      GROUP BY x.thoigianxuat) b
WHERE a.thoigian = b.thoigian;


SELECT p.thoigiannhap thoigian, SUM(c.gianhap) von
FROM phieunhapkho p
         INNER JOIN sanpham s ON p.maphieunhap = s.phieunhap
         INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
GROUP BY p.thoigiannhap;
SELECT x.thoigianxuat thoigian, SUM(c.giaxuat) doanhthu
FROM phieuxuatkho x
         INNER JOIN sanpham s ON x.maphieuxuat = s.phieunhap
         INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
GROUP BY x.thoigianxuat;

SELECT a.thoigian, a.von, b.doanhthu, doanhthu - von loinhuan
FROM (SELECT p.thoigiannhap thoigian, SUM(c.gianhap) von
      FROM phieunhapkho p
               INNER JOIN sanpham s ON p.maphieunhap = s.phieunhap
               INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
      GROUP BY p.thoigiannhap) a,
     (SELECT x.thoigianxuat thoigian, SUM(c.giaxuat) doanhthu
      FROM phieuxuatkho x
               INNER JOIN sanpham s ON x.maphieuxuat = s.phieunhap
               INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
      GROUP BY x.thoigianxuat) b
WHERE a.thoigian = b.thoigian
  AND MONTH(a.thoigian) = ?
  AND YEAR(a.thoigian) = ?
ORDER BY a.thoigian;


SELECT p.maphieunhap, n.tennhacungcap, nv.hoten, p.thoigiannhap thoigian, SUM(c.gianhap) tongtien
FROM phieunhapkho p
         INNER JOIN nhacungcap n ON p.nhacungcap = n.manhacungcap
         INNER JOIN nhanvien nv ON p.nhanviennhap = nv.manhanvien
         RIGHT JOIN sanpham s ON p.maphieunhap = s.phieunhap
         INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
# WHERE n.manhacungcap = ?
#   AND manhanvien = ?
#   AND p.thoigiannhap BETWEEN ? AND ?
GROUP BY p.maphieunhap, thoigiannhap
# HAVING tongtien BETWEEN ? AND ?
ORDER BY thoigian DESC;


SELECT p.maphieuxuat, k.tenkhachhang, n.hoten, p.thoigianxuat thoigian, SUM(c.giaxuat) tongtien
FROM phieuxuatkho p
         INNER JOIN khachhang k ON p.khachhang = k.makhachhang
         INNER JOIN nhanvien n ON p.nhanvienxuat = n.manhanvien
         INNER JOIN sanpham s ON p.maphieuxuat = s.phieuxuat
         INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
WHERE k.makhachhang = ?
  AND n.manhanvien = ?
  AND p.thoigianxuat BETWEEN ? AND ?
GROUP BY p.maphieuxuat, p.thoigianxuat
HAVING tongtien BETWEEN ? AND ?
ORDER BY p.thoigianxuat DESC;



SELECT MAX(thoigianxuat),
       MAX(thoigiannhap),
       MIN(thoigianxuat),
       MIN(thoigiannhap)
FROM phieuxuatkho x,
     phieunhapkho n
GROUP BY x.thoigianxuat, n.thoigiannhap;


SELECT(SELECT thoigianxuat thoigian
       FROM phieuxuatkho
       UNION
       SELECT thoigiannhap thoigian
       FROM phieunhapkho
       ORDER BY thoigian
       LIMIT 1) mindate,
      (SELECT thoigianxuat thoigian
       FROM phieuxuatkho
       UNION
       SELECT thoigiannhap thoigian
       FROM phieunhapkho
       ORDER BY thoigian DESC
       LIMIT 1) maxdate;

SELECT thoigiannhap
FROM phieunhapkho
ORDER BY thoigiannhap
LIMIT 1;



SELECT thoigianxuat
FROM phieuxuatkho
ORDER BY thoigianxuat
LIMIT 1;



SELECT s.masanpham,
       s.maimei,
       d.tendanhmucsanpham,
       ram.dungluongram,
       rom.dungluongrom,
       mausac.tenmausac,
       c.gianhap
FROM sanpham s
         INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
         INNER JOIN ptpm.danhmucsanpham d ON c.danhmucsanpham = d.madanhmucsanpham
         INNER JOIN ram ON c.ram = ram.maram
         INNER JOIN rom ON c.rom = rom.marom
         INNER JOIN mausac ON c.mausac = mausac.mamausac
WHERE phieunhap = ?;


SELECT d.madanhmucsanpham, d.phienbanhedieuhanh, h.*, t.*, x.*, COUNT(s.phieunhap) tonkho
FROM danhmucsanpham d
         INNER JOIN ptpm.cauhinh c ON d.madanhmucsanpham = c.danhmucsanpham
         INNER JOIN ptpm.sanpham s ON c.macauhinh = s.cauhinh
         INNER JOIN hedieuhanh h ON d.hedieuhanh = h.mahedieuhanh
         INNER JOIN thuonghieu t ON d.thuonghieu = t.mathuonghieu
         INNER JOIN xuatxu x ON d.xuatxu = x.maxuatxu
WHERE s.phieuxuat IS NULL
GROUP BY d.madanhmucsanpham
ORDER BY d.madanhmucsanpham DESC;



SELECT s.maimei, s.phieunhap, s.phieuxuat, t.tenhienthi tentinhtrang
FROM sanpham s
         INNER JOIN ptpm.cauhinh c ON s.cauhinh = c.macauhinh
         INNER JOIN ptpm.tinhtrang t ON s.tinhtrang = t.matinhtrang
         INNER JOIN danhmucsanpham d ON d.madanhmucsanpham = c.danhmucsanpham
WHERE madanhmucsanpham = 2
ORDER BY masanpham DESC;

SELECT *
FROM taikhoan t
         CROSS JOIN nhanvien n ON t.nhanvien = n.manhanvien
WHERE mail = 'root@mail';

SELECT *
FROM nhanvien
WHERE mail = 'root@mail';

INSERT INTO nhanvien (hoten, ngaysinh, mail, sodienthoai)
VALUES ('test', '2000/1/1', 'root@mail', '333');


SELECT q.maquyenhan quyen, h.tenhienthi hanhdong, c2.tenhienthi chucnang
FROM taikhoan
         INNER JOIN ptpm.nhomquyen n ON taikhoan.vaitro = n.manhomquyen
         INNER JOIN ctquyen c ON n.manhomquyen = c.nhomquyen
         INNER JOIN quyenhan q ON c.quyenhan = q.maquyenhan
         INNER JOIN chucnang c2 ON q.chucnang = c2.machucnang
         INNER JOIN hanhdong h ON q.hanhdong = h.mahanhdong
WHERE taikhoan.mataikhoan = 1
ORDER BY maquyenhan;

SELECT *
FROM nhanvien n
         LEFT JOIN taikhoan t ON n.manhanvien = t.nhanvien
GROUP BY n.manhanvien;

SELECT *
FROM taikhoan t
         LEFT JOIN nhanvien ON t.nhanvien = nhanvien.manhanvien;



SELECT q.maquyenhan, c.tenhienthi, h.tenhienthi
FROM quyenhan q
         INNER JOIN ptpm.chucnang c ON q.chucnang = c.machucnang
         INNER JOIN hanhdong h ON q.hanhdong = h.mahanhdong
ORDER BY maquyenhan;


SELECT p.*
FROM phieuxuatkho p
         INNER JOIN sanpham s ON s.phieuxuat = p.maphieuxuat
GROUP BY p.maphieuxuat
HAVING COUNT(DISTINCT s.masanpham) = 0;

SELECT *
FROM danhmucsanpham d
         INNER JOIN ptpm.cauhinh c on d.madanhmucsanpham = c.danhmucsanpham
         INNER JOIN sanpham s ON c.macauhinh = s.cauhinh
WHERE s.phieuxuat IS NULL
GROUP BY d.madanhmucsanpham;


SELECT p.maphieuxuat, p.thoigianxuat, COUNT(DISTINCT sanpham.masanpham) soluong, SUM(c.giaxuat) thanhtien
FROM phieuxuatkho p
         INNER JOIN khachhang k ON p.khachhang = k.makhachhang
         INNER JOIN sanpham ON p.maphieuxuat = sanpham.phieuxuat
         INNER JOIN cauhinh c ON sanpham.cauhinh = c.macauhinh
WHERE makhachhang = ?
GROUP BY p.maphieuxuat;

SELECT p.maphieunhap, p.thoigiannhap, COUNT(DISTINCT sanpham.masanpham) soluong, SUM(c.giaxuat) thanhtien
FROM phieunhapkho p
         INNER JOIN nhacungcap n ON p.nhacungcap = n.manhacungcap
         INNER JOIN sanpham ON p.maphieunhap = sanpham.phieuxuat
         INNER JOIN cauhinh c ON sanpham.cauhinh = c.macauhinh
WHERE manhacungcap = ?
GROUP BY p.maphieunhap;


SELECT *
FROM danhmucsanpham d
         INNER JOIN ptpm.cauhinh c on d.madanhmucsanpham = c.danhmucsanpham



SELECT *
FROM phieuxuatkho;



UPDATE sanpham
SET phieuxuat = ?
WHERE masanpham IN
      (SELECT *
       FROM (SELECT masanpham
             FROM sanpham
             WHERE phieuxuat IS NULL
               AND cauhinh = ?
             LIMIT ?) a);


SELECT *
FROM sanpham;



SELECT d.madanhmucsanpham,
       d2.tondauki                                                                        tondau,
       COUNT(DISTINCT s.masanpham)                                                        tongnhap,
       SUM(IF(s.phieuxuat IS NOT NULL, 1, 0))                                             tongxuat,
       d2.tondauki + COUNT(DISTINCT s.masanpham) - SUM(IF(s.phieuxuat IS NOT NULL, 1, 0)) toncuoi
FROM danhmucsanpham d
         LEFT JOIN cauhinh c ON d.madanhmucsanpham = c.danhmucsanpham
         LEFT JOIN sanpham s ON c.macauhinh = s.cauhinh
         LEFT JOIN phieunhapkho n ON s.phieunhap = n.maphieunhap
         LEFT JOIN phieuxuatkho x ON s.phieuxuat = x.maphieuxuat
         LEFT JOIN
     (SELECT d.madanhmucsanpham,
             COUNT(DISTINCT s.masanpham) - SUM(IF(s.phieuxuat IS NOT NULL, 1, 0)) tondauki
      FROM danhmucsanpham d
               LEFT JOIN cauhinh c ON d.madanhmucsanpham = c.danhmucsanpham
               LEFT JOIN sanpham s ON c.macauhinh = s.cauhinh
               LEFT JOIN phieunhapkho n ON s.phieunhap = n.maphieunhap
               LEFT JOIN phieuxuatkho x ON s.phieuxuat = x.maphieuxuat
      WHERE n.thoigiannhap < ?
        AND x.thoigianxuat < ?
      GROUP BY d.madanhmucsanpham) d2 ON d2.madanhmucsanpham = d.madanhmucsanpham
WHERE n.thoigiannhap BETWEEN ? AND ?
  AND x.thoigianxuat BETWEEN ? AND ?
GROUP BY d.madanhmucsanpham;



SELECT d.madanhmucsanpham, count(distinct s.masanpham)
FROM danhmucsanpham d
         LEFT JOIN cauhinh c ON d.madanhmucsanpham = c.danhmucsanpham
         LEFT JOIN sanpham s ON c.macauhinh = s.cauhinh
WHERE s.phieuxuat IS NOT NULL
GROUP BY d.madanhmucsanpham;

































