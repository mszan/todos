const express = require('express');
const app = express();

const logger = require('morgan');
const cors = require('cors');

app.use(cors())
app.use(express.json());
app.use(logger('dev'));

const apiRoutes = require('./routes/api/_api')
app.use('/api', apiRoutes.authorization)
app.use('/api/users', apiRoutes.users)
app.use('/api/tasks', apiRoutes.tasks)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

module.exports = app;