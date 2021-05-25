const express = require('express');
const app = express();

const logger = require('morgan');
const cors = require('cors');

const apiRoutes = require('./routes/api/_api')
const authMiddleware = require("./cors/authorization");
const middleware = require("./cors/middleware");

app.use(cors({origin: '*'}))
app.use(express.json());
app.use(logger('dev'));

app.use('/api', apiRoutes.authorization)
app.use('/api/users', authMiddleware.authenticate, apiRoutes.users)
app.use('/api/tasks', authMiddleware.authenticate, middleware.tasks, apiRoutes.tasks)
app.use('/api/public', apiRoutes.publicStats)

app.listen(5000, () => {
    console.log(`Listening on port 5000`)
})

module.exports = app;