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

module.exports = app
