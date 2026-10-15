// Script to add profile fields to database
const mysql = require('mysql2/promise');

async function addProfileFields() {
    console.log('Connecting to database...');
    const conn = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        database: 'ptpm',
        password: '',
        port: 3306
    });

    try {
        console.log('Adding new columns to nhanvien table...');

        // Check and add columns one by one (MySQL doesn't support IF NOT EXISTS for columns)
        const columns = [
            { name: 'cccd', type: 'VARCHAR(20) DEFAULT NULL' },
            { name: 'avatar', type: 'VARCHAR(500) DEFAULT NULL' },
            { name: 'tinh', type: 'VARCHAR(100) DEFAULT NULL' },
            { name: 'quan', type: 'VARCHAR(100) DEFAULT NULL' },
            { name: 'phuong', type: 'VARCHAR(100) DEFAULT NULL' },
            { name: 'diachi', type: 'VARCHAR(255) DEFAULT NULL' }
        ];

        for (const col of columns) {
            try {
                await conn.query(`ALTER TABLE nhanvien ADD COLUMN ${col.name} ${col.type}`);
                console.log(`  ✓ Added column: ${col.name}`);
            } catch (e) {
                if (e.code === 'ER_DUP_FIELDNAME') {
                    console.log(`  - Column ${col.name} already exists`);
                } else {
                    throw e;
                }
            }
        }

        // Update sample data
        console.log('\nUpdating sample employee data...');
        await conn.query(`
      UPDATE nhanvien SET 
        cccd = '079123456789',
        tinh = 'TP. Hồ Chí Minh',
        quan = 'Quận 1',
        phuong = 'Phường Bến Nghé',
        diachi = '123 Nguyễn Huệ'
      WHERE manhanvien = 1
    `);

        await conn.query(`
      UPDATE nhanvien SET 
        cccd = '079234567890',
        tinh = 'TP. Hồ Chí Minh',
        quan = 'Quận 3',
        phuong = 'Phường 1',
        diachi = '456 Võ Văn Tần'
      WHERE manhanvien = 2
    `);

        await conn.query(`
      UPDATE nhanvien SET 
        cccd = '079345678901',
        tinh = 'TP. Hồ Chí Minh',
        quan = 'Quận 7',
        phuong = 'Phường Tân Phú',
        diachi = '789 Nguyễn Văn Linh'
      WHERE manhanvien = 3
    `);

        console.log('  ✓ Updated employee data');

        // Verify
        const [employees] = await conn.query('SELECT * FROM nhanvien LIMIT 3');
        console.log('\nVerification - First 3 employees:');
        employees.forEach(e => {
            console.log(`  ${e.manhanvien}: ${e.hoten} | ${e.mail} | ${e.cccd || 'no CCCD'} | ${e.tinh || 'no address'}`);
        });

        console.log('\n✅ Database update completed!');
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await conn.end();
    }
}

addProfileFields();
