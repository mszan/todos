const express = require('express');
const app = express();

const logger = require('morgan');
const cors = require('cors');

const apiRoutes = require('./routes/api/_api')
const authMiddleware = require("./cors/authorization");
const middleware = require("./cors/middleware");

app.use(cors())
app.use(middleware.setCorsHeader)
app.use(express.json());
app.use(logger('dev'));

app.use('/api', apiRoutes.authorization)
app.use('/api/users', authMiddleware.authenticate, apiRoutes.users)
app.use('/api/tasks', authMiddleware.authenticate, middleware.tasks, apiRoutes.tasks)
app.use('/api/public', apiRoutes.publicStats)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

module.exports = app;