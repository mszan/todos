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

// Get public statistics of tasks.
app.get("/tasks", (req, res) => {
    try {
        // Get data from request parameters.
        const { active } = req.query

        // If active is passed, check if its valid
        if (active) {
            if (!(active === "0" || active === "1")) {
                return res.status(400).json({"msg": "Wrong 'active' value. Use '1' or '0'."})
            }
        }

        let finalRes = [] // Holds final result that will be used in response.
        let query = "SELECT COUNT(id) AS count FROM tasks" // Query string
        active ? query += ` WHERE active =${active}` : null // Filter with 'active' value if it's passed

            // Query for data.
            pool.query(query)
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
