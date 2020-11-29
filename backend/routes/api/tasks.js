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
            .then(queryRes => {
                res.json(queryRes[0])
            })
    }
    catch (err) {
        console.error(err.message)
    }
})

// Add task related to authenticated user.
app.post("/", authToken.authenticate, (req, res) => {
    try {
        // Get data from request body.
        // *title - str
        // *description - str
        // *dueDate - str e.g.: 2020-11-28 23:41:43
        // priority - int TODO: set priority schema
        let {title, description, dueDate, priority} = req.body

        // Check for required data.
        if (!title || !description || !dueDate) res.json({"msg": "Missing required parameters."})

        // Check if priority is send, if not set default.
        if (!priority) priority = 1

        // Insert to tasks table.
        pool.query("INSERT INTO tasks(title, description, priority, dueDate, users__id) VALUES(?, ?, ?, ?, ?)",
            [title, description, priority, dueDate, res.locals.userId])
            .then(queryRes => {
                res.json({"msg": `Task ${queryRes[0]['insertId']} added.`})
            })
    } catch (err) {
        console.error(err.message)
    }
})

// Update task related to authenticated user.
app.put("/:id", authToken.authenticate, async (req, res) => {
    try {

        // Checks for passed field and assigns them to new dictionary.
        const fields = {}
        if (req.body.title) fields['title'] = req.body.title
        if (req.body.description) fields['description'] = req.body.description
        if (req.body.dueDate) fields['dueDate'] = req.body.dueDate
        if (req.body.priority) fields['priority'] = req.body.priority

        if (req.body.completeDate) fields['completeDate'] = req.body.completeDate
        if (req.body.completeDate === null) fields['completeDate'] = null

        // Holds final information about updated task.
        let resMsg = {"msg": `Task ${req.params.id} updated.`, "updatedFields": {}}

        // Queries for every field to be updated.
        for (const field in fields) {
            await pool.query(`UPDATE tasks SET ${field} = ? WHERE id = ? AND users__id = ?`,
                [fields[field], parseInt(req.params.id), res.locals.userId])
                .then(() => {
                    resMsg["updatedFields"][field] = fields[field]
                })
        }
        res.json(resMsg)
    } catch (err) {
        console.error(err.message)
    }
})

// Delete task related to authenticated user.
// app.delete("/:id", (req, res) => {
//   try {
//   } catch (err) {
//     console.error(err.message)
//   }
// })


module.exports = app
