const express = require('express');
const app = express();

const logger = require('morgan');
const cors = require('cors');

app.use(cors())
app.use(express.json());
app.use(logger('dev'));

const apiRouter = require('./routes/api/_api');
app.use('/api', apiRouter);

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

module.exports = app;