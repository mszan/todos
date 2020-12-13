const express = require('express')
const app = express()
const pool = require("../../db")

// Get public statistics of users.
app.get("/users", (req, res) => {
    try {
        let finalRes = []
        // Query for data.
        pool.query("SELECT COUNT(username) AS count FROM users")
            .then(queryRes => {
                finalRes.push(queryRes[0][0])
            })
            .then(() => {
                res.json(finalRes)
            })
    }
    catch (err) {
        console.error(err.message)
    }
})

app.get("/tasks", (req, res) => {
    try {
        let finalRes = []
        // Query for data.
        pool.query("SELECT COUNT(id) AS count FROM tasks")
            .then(queryRes => {
                finalRes.push(queryRes[0][0])
            })
            .then(() => {
                res.json(finalRes)
            })
    }
    catch (err) {
        console.error(err.message)
    }
})

module.exports = app
