// Script to fix statistics data by aligning import/export dates
const mysql = require('mysql2/promise');

async function fixData() {
    console.log('Connecting to database...');
    const conn = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        database: 'ptpm',
        password: '',
        port: 3306
    });

    try {
        console.log('Updating phieunhapkho dates to match phieuxuatkho dates...');

        // Update imports to have matching dates with exports
        await conn.query("UPDATE phieunhapkho SET thoigiannhap = '2026-02-01 08:00:00' WHERE maphieunhap = 1");
        await conn.query("UPDATE phieunhapkho SET thoigiannhap = '2026-02-15 08:00:00' WHERE maphieunhap = 2");
        await conn.query("UPDATE phieunhapkho SET thoigiannhap = '2026-03-05 08:00:00' WHERE maphieunhap = 3");
        await conn.query("UPDATE phieunhapkho SET thoigiannhap = '2026-03-20 08:00:00' WHERE maphieunhap = 4");
        await conn.query("UPDATE phieunhapkho SET thoigiannhap = '2026-04-10 08:00:00' WHERE maphieunhap = 5");
        console.log('  ✓ Updated 5 import dates');

        // Add more exports
        console.log('Adding more exports...');
        const [existingExports] = await conn.query("SELECT COUNT(*) as cnt FROM phieuxuatkho");
        if (existingExports[0].cnt < 10) {
            await conn.query(`
        INSERT INTO phieuxuatkho (thoigianxuat, khachhang, nhanvienxuat)
        VALUES 
        ('2026-02-01 14:00:00', 2, 2),
        ('2026-02-15 16:00:00', 3, 3),
        ('2026-03-05 11:00:00', 1, 1),
        ('2026-03-20 15:00:00', 4, 2),
        ('2026-04-10 10:00:00', 5, 3)
      `);
            console.log('  ✓ Added 5 new exports');
        } else {
            console.log('  - Exports already exist, skipping');
        }

        // Update sanpham to link to new exports
        console.log('Linking products to exports...');
        await conn.query("UPDATE sanpham SET phieuxuat = 6, tinhtrang = 2 WHERE masanpham = 2 AND phieuxuat IS NULL");
        await conn.query("UPDATE sanpham SET phieuxuat = 7, tinhtrang = 2 WHERE masanpham = 3 AND phieuxuat IS NULL");
        await conn.query("UPDATE sanpham SET phieuxuat = 8, tinhtrang = 2 WHERE masanpham = 8 AND phieuxuat IS NULL");
        await conn.query("UPDATE sanpham SET phieuxuat = 9, tinhtrang = 2 WHERE masanpham = 10 AND phieuxuat IS NULL");
        await conn.query("UPDATE sanpham SET phieuxuat = 10, tinhtrang = 2 WHERE masanpham = 14 AND phieuxuat IS NULL");
        console.log('  ✓ Linked more products to exports');

        // Verify the data
        console.log('\nVerifying data:');
        const [imports] = await conn.query("SELECT COUNT(*) as cnt FROM phieunhapkho");
        const [exports] = await conn.query("SELECT COUNT(*) as cnt FROM phieuxuatkho");
        const [sold] = await conn.query("SELECT COUNT(*) as cnt FROM sanpham WHERE phieuxuat IS NOT NULL");
        console.log(`  Imports: ${imports[0].cnt}`);
        console.log(`  Exports: ${exports[0].cnt}`);
        console.log(`  Products sold: ${sold[0].cnt}`);

        // Test revenue query
        console.log('\nTesting revenue query:');
        const [revenue] = await conn.query(`
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
      LIMIT 7
    `);

        if (revenue.length > 0) {
            console.log('  ✓ Revenue data found:');
            revenue.forEach(r => {
                console.log(`    ${r.thoigian}: Revenue=${r.doanhthu}, Cost=${r.von}, Profit=${r.loinhuan}`);
            });
        } else {
            console.log('  ✗ No revenue data found');
        }

        console.log('\n✅ Database fix completed!');
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await conn.end();
    }
}

fixData();
