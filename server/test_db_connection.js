const mysql = require('mysql2/promise');

async function tryConnect(host, user, password) {
    console.log(`\nTesting connection to ${host} with user '${user}'...`);
    try {
        const connection = await mysql.createConnection({
            host: host,
            user: user,
            database: 'ptpm',
            password: password,
            port: 3306
        });
        console.log(`SUCCESS: Connected to specific database 'ptpm' on ${host}!`);
        await connection.end();
        return true;
    } catch (error) {
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.log(`CONNECTED but database 'ptpm' missing.`);
            // Try again without database to confirm connection
            try {
                const connection = await mysql.createConnection({
                    host: host,
                    user: user,
                    password: password,
                    port: 3306
                });
                console.log(`SUCCESS: Connected to server on ${host} (but db 'ptpm' is missing)!`);
                await connection.end();
                return true;
            } catch (e2) {
                console.log("Failed to connect even without db specified.");
            }
        } else {
            console.error(`FAILED: ${error.message} (${error.code})`);
        }
        return false;
    }
}

async function run() {
    await tryConnect('127.0.0.1', 'root', '');
    await tryConnect('localhost', 'root', '');
}

run();
