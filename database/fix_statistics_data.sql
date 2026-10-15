-- Script to update database with better sample data for statistics display
-- Run this in MySQL Workbench after running production.sql

USE ptpm;

-- Update phieunhapkho to have matching dates with phieuxuatkho
-- We need at least some imports and exports on the SAME DAY for revenue queries to work

-- First, let's update imports to match some export dates
UPDATE phieunhapkho SET thoigiannhap = '2026-02-01 08:00:00' WHERE maphieunhap = 1;
UPDATE phieunhapkho SET thoigiannhap = '2026-02-15 08:00:00' WHERE maphieunhap = 2;
UPDATE phieunhapkho SET thoigiannhap = '2026-03-05 08:00:00' WHERE maphieunhap = 3;
UPDATE phieunhapkho SET thoigiannhap = '2026-03-20 08:00:00' WHERE maphieunhap = 4;
UPDATE phieunhapkho SET thoigiannhap = '2026-04-10 08:00:00' WHERE maphieunhap = 5;

-- Add more exports to create richer data
INSERT INTO phieuxuatkho (thoigianxuat, khachhang, nhanvienxuat)
VALUES 
('2026-02-01 14:00:00', 2, 2),
('2026-02-15 16:00:00', 3, 3),
('2026-03-05 11:00:00', 1, 1),
('2026-03-20 15:00:00', 4, 2),
('2026-04-10 10:00:00', 5, 3);

-- Update existing sanpham to have more exports
UPDATE sanpham SET phieuxuat = 6, tinhtrang = 2 WHERE masanpham = 2;  -- Was tồn kho
UPDATE sanpham SET phieuxuat = 7, tinhtrang = 2 WHERE masanpham = 3;  -- Was tồn kho
UPDATE sanpham SET phieuxuat = 8, tinhtrang = 2 WHERE masanpham = 8;  -- Was tồn kho
UPDATE sanpham SET phieuxuat = 9, tinhtrang = 2 WHERE masanpham = 10; -- Was tồn kho
UPDATE sanpham SET phieuxuat = 10, tinhtrang = 2 WHERE masanpham = 14; -- Was tồn kho

-- Verify the data
SELECT 'Phieu Nhap Kho' as 'Table', COUNT(*) as 'Count' FROM phieunhapkho
UNION ALL
SELECT 'Phieu Xuat Kho', COUNT(*) FROM phieuxuatkho
UNION ALL
SELECT 'San Pham (Da Ban)', COUNT(*) FROM sanpham WHERE phieuxuat IS NOT NULL;

-- Check if revenue query now returns data
SELECT d.thoigian, SUM(d.doanhthu) doanhthu, SUM(v.von) von, SUM(doanhthu - von) loinhuan
FROM (SELECT DATE(thoigianxuat) thoigian, SUM(c.giaxuat) doanhthu
      FROM phieuxuatkho x
               INNER JOIN sanpham s ON s.phieuxuat = x.maphieuxuat
               INNER JOIN cauhinh c ON c.macauhinh = s.cauhinh
      GROUP BY thoigianxuat) d,
     (SELECT DATE(thoigiannhap) thoigian, SUM(c.gianhap) von
      FROM phieunhapkho n
               INNER JOIN sanpham s ON s.phieunhap = n.maphieunhap
               INNER JOIN cauhinh c ON c.macauhinh = s.cauhinh
      GROUP BY thoigiannhap) v
WHERE d.thoigian = v.thoigian
GROUP BY v.thoigian, d.thoigian
ORDER BY d.thoigian DESC
LIMIT 7;
