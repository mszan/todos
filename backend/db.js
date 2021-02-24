const mysql = require('mysql2/promise')
const pool = mysql.createPool({
    user: 'todos_api_root',
    password: 'Test@1234',
    host: 'localhost',
    port: 3306,
    database: 'todos'
})

// Check if DB connection is established.
pool.query("SELECT 1")
    .then(() => console.log('Database connection OK.'))
    .catch(err => console.log('DB connection failure.', err))

module.exports = pool