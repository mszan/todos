const express = require('express')
const app = express()
const pool = require("../../db")

// Gets all users.
app.get("/", async (req, res) => {
  try {
    // Get data from request params.
    const { username } = req.query

    // If username is set, check if it has more than 1 word
    if (username) {
      if (username.split(" ").length > 1) {
        return res.status(400).json({"msg": "Wrong 'username' value."})
      }
    }

    // Query string.
    let query = "SELECT id, username, firstname, lastname, active, registerDate FROM users"
    username ? query += ` WHERE username = '${username}'` : null

    pool.query(query)
        .then(queryRes => {
          res.json(queryRes[0])
        })

  } catch(err) {
    console.error(err.message)
  }
})

// Gets specific user.
app.get("/:username", async (req, res) => {
  try {
    // Get data from request params.
    const username = req.params.username

    // Check if username parameter is being passed.
    if (!username) return res.status(400).json({"msg": "Missing 'username' parameter."})

    // Check if it has more than 1 word
    if (username) {
      if (username.split(" ").length > 1) return res.status(400).json({"msg": "Wrong 'username' value."})
    }

    // Query to database.
    pool.query("SELECT id, username, firstname, lastname, active, registerDate FROM users WHERE username = ?",
        [username])
        .then(queryRes => res.json(queryRes[0]))

  } catch(err) {
    console.error(err.message)
  }
})

module.exports = app
