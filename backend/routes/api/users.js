const express = require('express')
const app = express()
const pool = require("../../db")
const bcrypt = require("bcrypt")

// Gets all users.
app.get("/", async (req, res) => {
  try {
    const getUsers = await pool.query("SELECT id, username, firstname, lastname, active, registerDate FROM users")
    res.json(getUsers[0])
  } catch(err) {
    console.error(err.message)
  }
})

// Adds new user.
app.post("/", async (req, res) => {
  try {
    // Get data from request body.
    let {username, password, firstname, lastname, email} = req.body

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
    await pool.query("INSERT INTO users(username, password, firstname, lastname, email) VALUES(?, ?, ?, ?, ?)",
        [username, hashedPassword, firstname, lastname, email])

    res.json({"msg": `User '${username}' added.`})
  } catch (err) {
    console.error(err.message)
  }
})

module.exports = app
