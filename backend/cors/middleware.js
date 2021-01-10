const pool = require("../db")

function setCorsHeader(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://todos.mszanowski.pl');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
}

function tasks(req, res, next) {
    res.locals.tasksPrivileges = {}
    pool.query("SELECT usersRoles.addTasks, usersRoles.modifyTasks, usersRoles.modifyAllTasks, usersRoles.getAllTasks, usersRoles.getTasks, usersRoles.deleteTasks FROM users LEFT JOIN usersRoles ON users.usersRoles__id = usersRoles.id WHERE users.id = ?",
        [res.locals.userId])
        .then(queryRes => {
            for(const field in queryRes[0][0]){
                res.locals.tasksPrivileges[field] = queryRes[0][0][field]
            }
            next()
        })
}

module.exports = {tasks, setCorsHeader}