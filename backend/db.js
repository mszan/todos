const mysql = require('mysql2/promise')
const pool = mysql.createPool({
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD,
    host: 'mysql',
    port: 3306,
    database: 'todos'
})

// Check if DB connection is established.
pool.query("SELECT 1")
    .then(() => console.log('Database connection OK.'))
    .catch(err => console.log('DB connection failure.', err))

module.exports = pool