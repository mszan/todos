const express = require('express')
const app = express()
const pool = require("../db")
const bcrypt = require("bcrypt")
const authToken = require("../../cors/authorization")

// Gets all active tasks related to authenticated user.
app.get("/", authToken.authenticate, (req, res) => {
  try {
    pool.query("SELECT id, title, description, priority, addDate, dueDate, completeDate FROM tasks WHERE users__id = ?",
        [res.locals.userId])
        .then(tasksQueryRes => {
          res.json(tasksQueryRes[0])
        })
  }
   catch (err) {
    console.error(err.message)
  }
})

// Add task related to authenticated user.
app.post("/", async (req, res) => {
  try {
  } catch (err) {
    console.error(err.message)
  }
})

// Update task related to authenticated user.
app.put("/:id", async (req, res) => {
  try {
  } catch (err) {
    console.error(err.message)
  }
})

// Delete task related to authenticated user.
app.delete("/:id", async (req, res) => {
  try {
  } catch (err) {
    console.error(err.message)
  }
})


module.exports = app
