const express = require('express')
const app = express()
require('dotenv').config()
const routes = require('./routes/')
const path = require('path')
const cookieParser = require('cookie-parser')
const utilities = require('./utilities/')

const port = process.env.PORT

app.use(express.static('public', {
    index: false // This prevents from accessing index directly before the app check if a token exists
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// This route will have the middleware to check jwt and then will redirect to index.html
app.get('/', utilities.checkJWT, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.use('/', routes)

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})
