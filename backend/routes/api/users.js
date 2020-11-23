const express = require('express')
const app = express()
const pool = require("../db")
const bcrypt = require("bcrypt")
const authToken = require("../../cors/authToken")

// Gets all users.
app.get("/", authToken.authenticate, async (req, res) => {
  try {
    const getUsers = await pool.query("SELECT id, username, firstname, lastname, email, active, registerDate FROM users")
    res.json(getUsers[0])
  } catch(err) {
    console.error(err.message)
  }
})

// Adds new user.
app.post("/", async (req, res) => {
  try {
    const {username, password, firstname, lastname, email} = req.body
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    await pool.query("INSERT INTO users(username, password, firstname, lastname, email) VALUES(?, ?, ?, ?, ?)", [username, hashedPassword, firstname, lastname, email])
    res.json({"msg": `User '${username}' added.`})
  } catch (err) {
    console.error(err.message)
  }
})

module.exports = app
