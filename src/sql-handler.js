const path = require('path')
const fs = require('fs')
const mysql = require('mysql2/promise');

const cache = new Map();
const sql = path.join(__dirname, '..', 'sql');

const connection = await mysql.createConnection({
    host: 'localhost',
    password: '12345678',
    database: 'vulcanus'
});

async function loadSql(fileName) {
    if (cache.has(fileName)) return cache.get(fileName);

    const sql = await fs.readFile(path.join(SQL_DIR, fileName), 'utf8');
    cache.set(fileName, sql);
    return sql;
}

function splitStatements(sql) {
    return sql
        .split(/;\s*(?:\r?\n|$)/)
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'));
}

for (const statement of splitStatements(sql)) {
    await conn.query(statement);
}

async function execute(fileName, params = []) {
    const sqlQuery = await loadSql(fileName)
    var sql = splitStatements(sqlQuery)

    for (const [index, value] of params.entries()) {
        for (const [rowIndex, row] of sql) {
            sql[rowIndex] = row.replaceAll("!" + index + "!", value)
        }
    }

    var queryResults = []

    for (const [index, query] of sql) {
        const results = await connection.execute(query);
        queryResults[index] = results
    }

    return results
}

async function preloadAll() {
    const files = await fs.readdir(SQL_DIR);
    await Promise.all(
        files.filter(f => f.endsWith('.sql')).map(loadSql)
    );
}

preloadAll()
module.exports = { execute, loadSql };