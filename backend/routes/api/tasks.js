const moment = require('moment')
const express = require('express')
const app = express()
const pool = require("../../db")

// Get tasks.
app.get("/", (req, res) => {
    try {
        // Check if user has getTasks privilege.
        if (res.locals.tasksPrivileges['getTasks'] === 0) return res.sendStatus(403)

        // Get data from 'all' parameter. Display all users' tasks if it's not null.
        let { all } = req.query
        if (all) {
            // Check if user has getAllTasks privilege.
            if (res.locals.tasksPrivileges['getAllTasks'] === 0) return res.sendStatus(403)

            // Check if parameter data is valid (must be a boolean).
            try {
                all = JSON.parse(all)
            } catch {
                return res.status(400).json({"msg": "'all' parameter must be a boolean represented by string - 'true' or 'false'."})
            }
        }

        // Get date from 'addDate' parameter. Input format: YYYY-MM-DD
        let { addDate } = req.query
        if (addDate) {
            // Check if parameter data is valid.
            try {
                addDate = moment(addDate, "YYYY-MM-DD", true)
                if (!addDate.isValid()) return res.status(400).json({"msg": "'addDate' parameter must be a moment() with YYYY-MM-DD format'."})
            } catch {
                return res.status(400).json({"msg": "'addDate' parameter must be a moment() with YYYY-MM-DD format'."})
            }
        }

        // Get date from 'dueDate' parameter. Input format: YYYY-MM-DD
        let { dueDate } = req.query
        if (dueDate) {
            // Check if parameter data is valid.
            try {
                dueDate = moment(dueDate, "YYYY-MM-DD", true)
                if (!dueDate.isValid()) return res.status(400).json({"msg": "'dueDate' parameter must be a moment() with YYYY-MM-DD format'."})
            } catch {
                return res.status(400).json({"msg": "'dueDate' parameter must be a moment() with YYYY-MM-DD format'."})
            }
        }

        // Get date from 'completeDate' parameter. Input format: YYYY-MM-DD
        let { completeDate } = req.query
        if (completeDate) {
            // Check if parameter data is valid.
            try {
                completeDate = moment(completeDate, "YYYY-MM-DD", true)
                if (!completeDate.isValid()) return res.status(400).json({"msg": "'completeDate' parameter must be a moment() with YYYY-MM-DD format'."})
            } catch {
                return res.status(400).json({"msg": "'completeDate' parameter must be a moment() with YYYY-MM-DD format'."})
            }
        }

        // Get data 'orderField' and 'orderType' request parameters.
        const { orderField } = req.query
        let { orderType } = req.query

        // If orderField is set, check orderType value. Must be "ASC" or "DESC".
        if (orderField) {
            if (!(orderType === "ASC" || orderType === "DESC")) {
                return res.status(400).json({"msg": "Missing / wrong 'orderType' value. Use 'ASC' or 'DESC'."})
            }
        }

        // Get data from 'active' parameter.
        const { active } = req.query

        // If active is set, check active value. Must be string 1 or string 0.
        if (active) {
            if (!(active === "0" || active === "1")) {
                return res.status(400).json({"msg": "Wrong 'active' value. Use '1' or '0'."})
            }
        }

        // Base query string
        let query = `SELECT id, active, title, description, priority, addDate, dueDate, completeDate FROM tasks WHERE TRUE` // Base query.

        if (!all) query+= ` AND users__id = ${res.locals.userId}` // Filter by currently logged user.
        if (active) query += ` AND active = ${active}` // Filter by active tasks.
        if (addDate) query += ` AND addDate >= "${addDate.format("YYYY-MM-DD")} 00:00:00" AND addDate < "${addDate.add(1, "days").format("YYYY-MM-DD")} 00:00:00"` // Filter by addDate.
        if (dueDate) query += ` AND dueDate >= "${dueDate.format("YYYY-MM-DD")} 00:00:00" AND dueDate < "${dueDate.add(1, "days").format("YYYY-MM-DD")} 00:00:00"` // Filter by dueDate.
        if (completeDate) query += ` AND completeDate >= "${completeDate.format("YYYY-MM-DD")} 00:00:00" AND completeDate < "${completeDate.add(1, "days").format("YYYY-MM-DD")} 00:00:00"` // Filter by completeDate.

        orderField ? query += ` ORDER BY ${orderField} ${orderType}` : query += ` ORDER BY -dueDate DESC` // Correct ordering, more here: https://stackoverflow.com/questions/2051602/mysql-orderby-a-number-nulls-last

        pool.query(query)
            .then(queryRes => {
                res.json(queryRes[0])
            })
            .catch(err => {
                console.log(err)
                res.sendStatus(400)
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
            await pool.query("UPDATE tasks SET ? = ? WHERE id = ? AND users__id = ?",
                [field, fields[field], parseInt(req.params.id), res.locals.userId])
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
        if (res.locals.tasksPrivileges['deleteTasks'] === 0) {
            return res.sendStatus(403)
        }

        // Get task's owner id.
        pool.query("SELECT users__id FROM tasks WHERE id = ?",
            [req.params.id])
            .then(queryRes => {
                const ownerId = parseInt(queryRes[0][0]['users__id'])
                // Check if user is owner of the task.
                if (ownerId === res.locals.userId) {
                    // Delete task.
                    pool.query("DELETE FROM tasks WHERE id = ?",
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
