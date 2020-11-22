const express = require('express')
const app = express()
const pool = require("../db")
const bcrypt = require('bcrypt')

// Gets all users.
app.get("/users", async (req, res) => {
  try {
    const getUsers = await pool.query("SELECT * FROM users")
    res.json(getUsers[0])
  } catch(err) {
    console.error(err.message)
  }
})

// Adds new user.
app.post("/users", async (req, res) => {
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

// app.post("/users/login", async (req, res) => {
//   try {
//     const {username, password} = req.body
//     const user = await pool.query("SELECT password FROM users WHERE username = ?", [username])
//     console.log(user[0][0]['password'])
//     if (await bcrypt.compare(password, user[0][0]['password'])) {
//       res.json({"msg": 'Logged in.'})
//     } else {
//       res.json({"msg": 'Not logged in.'})
//     }
//   } catch (err) {
//     console.error(err.message)
//   }
// })

module.exports = app
