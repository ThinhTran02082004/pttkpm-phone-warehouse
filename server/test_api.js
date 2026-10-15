// API Test Script - Improved
const http = require('http');

const endpoints = [
    { name: 'Statistics Overall', path: '/api/statistics/overall' },
    { name: 'Statistics Date', path: '/api/statistics/date' },
    { name: 'Statistics Profits Year', path: '/api/statistics/profits/year' },
    { name: 'Statistics TonKho', path: '/api/statistics/getTonKho?ngaybatdau=2020-01-01&ngayketthuc=2025-01-01' },
    { name: 'Products', path: '/api/products' },
    { name: 'Products with Configures', path: '/api/products/product-configures' },
    { name: 'Customers', path: '/api/customers' },
    { name: 'Suppliers', path: '/api/suppliers' },
    { name: 'Warehouse Imports', path: '/api/warehouse/import' },
    { name: 'Warehouse Exports', path: '/api/warehouse/export' },
    { name: 'Warehouse Items', path: '/api/warehouse/items' },
    { name: 'Roles', path: '/api/roles' },
    { name: 'Accounts', path: '/api/accounts' },
];

function testEndpoint(endpoint) {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:3002${endpoint.path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const hasData = json.Data !== undefined || json.success !== undefined;
                    const dataCount = Array.isArray(json.Data) ? json.Data.length : (json.Data ? 'object' : 'N/A');
                    resolve({
                        name: endpoint.name,
                        path: endpoint.path,
                        status: res.statusCode,
                        success: json.success,
                        dataCount: dataCount,
                        working: hasData
                    });
                } catch (e) {
                    resolve({ name: endpoint.name, path: endpoint.path, status: res.statusCode, error: 'Invalid JSON', raw: data.substring(0, 100) });
                }
            });
        });
        req.on('error', (e) => {
            resolve({ name: endpoint.name, path: endpoint.path, error: e.message });
        });
        req.setTimeout(5000, () => {
            req.destroy();
            resolve({ name: endpoint.name, path: endpoint.path, error: 'Timeout' });
        });
    });
}

async function runTests() {
    console.log('=========================================');
    console.log('        API ENDPOINT TEST RESULTS       ');
    console.log('=========================================');

    const results = [];
    for (const endpoint of endpoints) {
        const result = await testEndpoint(endpoint);
        results.push(result);
    }

    let working = 0;
    let failed = 0;

    for (const r of results) {
        if (r.working) {
            working++;
            console.log('[OK]    ' + r.name + ' -> records: ' + r.dataCount);
        } else {
            failed++;
            console.log('[FAIL]  ' + r.name + ' -> ' + (r.error || 'No data'));
        }
    }

    console.log('=========================================');
    console.log('SUMMARY: ' + working + ' working, ' + failed + ' failed');
    console.log('=========================================');
}

runTests();
