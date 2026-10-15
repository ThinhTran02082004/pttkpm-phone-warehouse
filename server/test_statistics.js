// Test specific statistics endpoints and show data
const http = require('http');

function testEndpoint(path, name) {
    return new Promise((resolve) => {
        http.get(`http://localhost:3002${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ name, data: json });
                } catch (e) {
                    resolve({ name, error: 'Invalid JSON' });
                }
            });
        }).on('error', (e) => {
            resolve({ name, error: e.message });
        });
    });
}

async function main() {
    console.log('=== STATISTICS DATA CHECK ===\n');

    // Test overall
    const overall = await testEndpoint('/api/statistics/overall', 'Overall');
    console.log('1. Overall Statistics:');
    if (overall.data?.Data) {
        const d = overall.data.Data;
        console.log(`   - Products: ${d.sanpham?.[0]?.sanpham || 0}`);
        console.log(`   - Customers: ${d.khachhang?.[0]?.khachhang || 0}`);
        console.log(`   - Employees: ${d.nhanvien?.[0]?.nhanvien || 0}`);
        console.log(`   - Revenue days: ${d.doanhthu?.length || 0} records`);
        if (d.doanhthu?.length > 0) {
            d.doanhthu.forEach(r => {
                console.log(`     Date: ${r.thoigian}, Revenue: ${r.doanhthu}, Profit: ${r.loinhuan}`);
            });
        }
    }

    // Test year profits
    const yearProfit = await testEndpoint('/api/statistics/profits/year', 'Year Profits');
    console.log('\n2. Year Profits:');
    if (yearProfit.data?.Data?.length > 0) {
        yearProfit.data.Data.forEach(r => {
            console.log(`   Year ${r.nam}: Cost=${r.von}, Revenue=${r.doanhthu}, Profit=${r.loinhuan}`);
        });
    } else {
        console.log('   No data');
    }

    // Test customer stats
    const customers = await testEndpoint('/api/statistics/customers?ngaybatdau=2020-01-01&ngayketthuc=2030-01-01', 'Customers');
    console.log('\n3. Customer Statistics:');
    if (customers.data?.Data?.length > 0) {
        console.log(`   Found ${customers.data.Data.length} customers with purchases`);
        customers.data.Data.forEach(c => {
            console.log(`   - ${c.tenkhachhang}: ${c.muahang} purchases, Total: ${c.tongtien} VND`);
        });
    } else {
        console.log('   No data');
    }

    // Test supplier stats
    const suppliers = await testEndpoint('/api/statistics/suppliers?ngaybatdau=2020-01-01&ngayketthuc=2030-01-01', 'Suppliers');
    console.log('\n4. Supplier Statistics:');
    if (suppliers.data?.Data?.length > 0) {
        console.log(`   Found ${suppliers.data.Data.length} suppliers`);
        suppliers.data.Data.forEach(s => {
            console.log(`   - ${s.tennhacungcap}: ${s.lannhap} imports, Total: ${s.tongtien} VND`);
        });
    } else {
        console.log('   No data');
    }

    // Test inventory
    const tonkho = await testEndpoint('/api/statistics/getTonKho?ngaybatdau=2020-01-01&ngayketthuc=2030-01-01', 'Inventory');
    console.log('\n5. Inventory Statistics:');
    if (tonkho.data?.Data?.length > 0) {
        console.log(`   Found ${tonkho.data.Data.length} product categories`);
    }

    console.log('\n=== CHECK COMPLETE ===');
}

main();
