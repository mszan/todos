const mysql = require('mysql2/promise')
const pool = mysql.createPool({
    user: 'todos_api_root',
    password: 'Test@1234',
    host: 'localhost',
    port: 3306,
    database: 'todos'
})

module.exports = pool