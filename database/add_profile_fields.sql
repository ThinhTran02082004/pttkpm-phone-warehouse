-- Script to add profile fields to nhanvien table
USE ptpm;

-- Add new columns to nhanvien table for complete profile
ALTER TABLE nhanvien
ADD COLUMN IF NOT EXISTS cccd VARCHAR(20) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS avatar VARCHAR(500) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS tinh VARCHAR(100) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS quan VARCHAR(100) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS phuong VARCHAR(100) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS diachi VARCHAR(255) DEFAULT NULL;

-- Update existing employees with sample data
UPDATE nhanvien SET 
  cccd = '079123456789',
  tinh = 'TP. Hồ Chí Minh',
  quan = 'Quận 1',
  phuong = 'Phường Bến Nghé',
  diachi = '123 Nguyễn Huệ'
WHERE manhanvien = 1;

UPDATE nhanvien SET 
  cccd = '079234567890',
  tinh = 'TP. Hồ Chí Minh',
  quan = 'Quận 3',
  phuong = 'Phường 1',
  diachi = '456 Võ Văn Tần'
WHERE manhanvien = 2;

-- Verify the changes
SELECT * FROM nhanvien;
