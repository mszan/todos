const express = require('express')
const app = express()
const pool = require("../../db")
// const moment = require('moment')

// Gets all active tasks related to authenticated user.
app.get("/", (req, res) => {
    try {
        // Check if user has privileges.
        if (res.locals.tasksPrivileges['getTasks'] === 0) {
            return res.sendStatus(403)
        }

        // Query for tasks.
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

// Gets all tasks.
app.get("/all", (req, res) => {
    try {
        // Check if user has privileges.
        if (res.locals.tasksPrivileges['getAllTasks'] === 0) {
            return res.sendStatus(403)
        }

        // Query for tasks.
        pool.query("SELECT id, title, description, priority, addDate, dueDate, completeDate FROM tasks",
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
app.post("/", (req, res) => {
    try {
        // Check if user has privileges.
        if (res.locals.tasksPrivileges['addTasks'] === 0) {
            return res.sendStatus(403)
        }

        // Get data from request body.
        let {title, description, dueDate, priority} = req.body

        // Check for required data.
        if (!title) res.json({"msg": "Missing required parameters."})

        // Check if priority is sent, if not set default.
        if (!priority) priority = 1

        // Check if description is sent, if not set null.
        if (!description) description = null

        // Check if dueDate is sent, if not set null.
        if (!dueDate) dueDate = null

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
app.put("/:id", async (req, res) => {
    try {
        if (res.locals.tasksPrivileges['modifyTasks'] === 0) {
            return res.sendStatus(403)
        }

        // Checks for passed field and assigns them to new dictionary.
        const fields = {}
        if (req.body.title) fields['title'] = req.body.title
        if (req.body.description) fields['description'] = req.body.description
        if (req.body.dueDate) fields['dueDate'] = req.body.dueDate
        if (req.body.priority) fields['priority'] = req.body.priority
        if (req.body.active) fields['active'] = req.body.active

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
app.delete("/:id", (req, res) => {
    try {
        // Get task's owner id.
        pool.query(`SELECT users__id FROM tasks WHERE id = ?`,
            [req.params.id])
            .then(queryRes => {
                const ownerId = parseInt(queryRes[0][0]['users__id'])
                // Check if user is owner of the task.
                if (ownerId === res.locals.userId) {
                    // Delete task.
                    pool.query(`DELETE FROM tasks WHERE id = ?`,
                        [req.params.id])
                        .then(() => {
                            res.json({"msg": `Task ${req.params.id} deleted.`})
                        })
                } else {
                    res.sendStatus(403)
                }
            })
    } catch (err) {
        console.error(err.message)
    }
})


module.exports = app
