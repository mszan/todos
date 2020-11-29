const express = require('express')
const app = express()
const pool = require("../../db")
const moment = require('moment')
const authToken = require("../../cors/authorization")
const bcrypt = require("bcrypt")


// Authenticate API users, if success generate accessToken and refreshToken.
app.post("/login", async (req, res) => {
    try {
        // Get user hashed password.
        const hashedPassword = await pool.query("SELECT password FROM users WHERE username = ?", [req.body.username])

        // Check if query result is not empty.
        // If hashed password is not found (user does not exist), return message.
        if (hashedPassword[0].length < 1) return res.json({"msg": "User and / or password invalid."})

        // Compare sent password and hashedPassword.
        bcrypt.compare(req.body.password, hashedPassword[0][0]['password'], (err, result) => {
            // Check if password and hashedPassword match.
            if (result) {
                // Generate new tokens.
                const accessToken = authToken.generateAccessToken({'username': req.body.username})
                const refreshToken = authToken.generateRefreshToken({'username': req.body.username})

                // Get user's id from users table.
                pool.query("SELECT id FROM users WHERE username = ?", [req.body.username])
                    .then(userId => {
                        // Get user's refreshToken from usersRefreshTokens table.
                        pool.query("SELECT id FROM usersRefreshTokens WHERE users__id = ?", [userId[0][0]['id']])
                            .then(r => {
                                // Check if result contains an entry.
                                if(r[0].length < 1) {
                                    // If not found, create a new entry.
                                    pool.query("INSERT INTO usersRefreshTokens(refreshToken, lastUpdated, users__id) VALUES (?, ?, ?)",
                                        [refreshToken, moment().format("YYYY-MM-DD HH:mm:ss"), userId[0][0]['id']])
                                } else {
                                    // If found, update existing one.
                                    pool.query("UPDATE usersRefreshTokens SET refreshToken = ? , lastUpdated = ? WHERE users__id = ?",
                                        [refreshToken, moment().format("YYYY-MM-DD HH:mm:ss"), userId[0][0]['id']])
                                }
                            })
                    })

                // Send response with accessToken and refreshToken.
                res.json({accessToken: accessToken, refreshToken: refreshToken})
            } else {
                return res.json({"msg": "User and / or password invalid."})
            }
        })
    } catch(err) {
        console.error(err.message)
    }
})

// Generate new accessToken in case it's expired, requires refreshToken.
app.post("/token", async (req, res) => {
    try {
        const refreshToken = req.body.token
        if (refreshToken == null) return res.sendStatus(401)

        // Get refreshToken from usersRefreshTokens.
        await pool.query("SELECT usersRefreshTokens.refreshToken, usersRefreshTokens.lastUpdated, users.username FROM usersRefreshTokens JOIN users ON usersRefreshTokens.users__id = users.id WHERE usersRefreshTokens.refreshToken = ?",
            [refreshToken])
            .then(r => {
                // Check if refreshToken is found in usersRefreshTokens table.
                if (r[0].length >= 1) {

                    // Check if refreshToken is not expired.
                    const lastUpdated = r[0][0]['lastUpdated']
                    if (moment(lastUpdated).add(5, 'days').isBefore(/*now*/)) console.log(lastUpdated)

                    // Generate new tokens.
                    const username = r[0][0]['username']

                    const newAccessToken = authToken.generateAccessToken({'username': username})
                    const newRefreshToken = authToken.generateRefreshToken({'username': username})

                    // Update refreshToken in usersRefreshTokens table.
                    pool.query("UPDATE usersRefreshTokens SET refreshToken = ?, lastUpdated = ? WHERE refreshToken = ?",
                        [newRefreshToken, moment().format("YYYY-MM-DD HH:mm:ss"), r[0][0]['refreshToken']])

                    // Return new tokens in response.
                    res.json({newAccessToken: newAccessToken, newRefreshToken: newRefreshToken})
                } else {
                    res.json({msg: "Invalid refreshToken."})
                }
            })
    } catch(err) {
        console.error(err.message)
    }
})

module.exports = app
