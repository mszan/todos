const express = require('express')
const app = express()
const pool = require("../../db")
const moment = require('moment')
const authToken = require("../../cors/authorization")
const bcrypt = require("bcrypt")

// Register new user
app.post("/register", async (req, res) => {
    try {
        // Get data from request body.
        let {username, password, email, firstname, lastname} = req.body

        // Check for required data.
        if (!username || !password || !email) res.json({"msg": "Missing required parameters."})

        // Check if firstname is sent, if not set null.
        if (!firstname) firstname = null

        // Check if lastname is sent, if not set null.
        if (!lastname) lastname = null

        // Generate salt.
        const salt = await bcrypt.genSalt()

        // Generate hashed password.
        const hashedPassword = await bcrypt.hash(password, salt)

        // Insert user to users table.
        await pool.query("INSERT INTO users(username, password, email, firstname, lastname) VALUES(?, ?, ?, ?, ?)",
            [username, hashedPassword, email, firstname, lastname])

        res.json({"msg": `User '${username}' registered.`})
    } catch (err) {
        console.error(err.message)
    }
})

// Authenticate API users, if success generate accessToken and refreshToken.
app.post("/login", async (req, res) => {
    try {
        // Get user hashed password.
        const hashedPassword = await pool.query("SELECT password FROM users WHERE username = ?", [req.body.username])

        // Check if query result is not empty.
        // If hashed password is not found (user does not exist), return message.
        if (hashedPassword[0].length < 1) return res.json({"msg": "User and / or password invalid / missing."})

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
        const refreshToken = req.body.refreshToken
        if (refreshToken == null) return res.json({"msg": "You need to pass refreshToken."})

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
