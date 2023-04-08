const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const connectDB = require('./db')
const auth = require('./auth')
const api = require('./api')
require('dotenv').config();


connectDB();

app.use(morgan("dev"))
app.use(cookieParser())
app.use(cors())
app.use(express.json())

app.use('/auth', auth)
app.use('/api', api)

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).send({
        msg: 'Extension server'
    });
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})