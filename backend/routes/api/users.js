const express = require('express')
const app = express()
const pool = require("../../db")

// Gets all users.
app.get("/", async (req, res) => {
  try {
    const { username } = req.query
    if (username) {
      if (username.split(" ").length > 1) {
        return res.status(400).json({"msg": "Wrong 'username' value."})
      }
    }

    let query = "SELECT id, username, firstname, lastname, active, registerDate FROM users"
    username ? query += ` WHERE username = '${username}'` : null

    console.log(query)

    pool.query(query)
        .then(queryRes => {
          res.json(queryRes[0])
        })

  } catch(err) {
    console.error(err.message)
  }
})

module.exports = app
