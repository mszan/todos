const express = require('express')
const app = express()
const pool = require("../db")
const jwt = require('jsonwebtoken')
const moment = require('moment')
const authToken = require("../../cors/authToken")
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

        // Create refreshToken entry in usersRefreshTokens table.
        pool.query("SELECT id FROM users WHERE username = ?", [req.body.username])
            .then(userId => {
              pool.query("INSERT INTO usersRefreshTokens(refreshToken, lastUpdated, user) VALUES (?, ?, ?)",
                  [refreshToken, moment().format("YYYY-MM-DD HH:mm:ss"), userId[0][0]['id']])
            })

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
    const refreshTokenDb = await pool.query("SELECT username FROM users WHERE refreshToken = ?", [refreshToken])
  } catch(err) {
    console.error(err.message)
  }
})

module.exports = app
