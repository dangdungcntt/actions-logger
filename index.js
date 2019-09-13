require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').createServer(app)
const mongodbUri = process.env.MONGODB_URI
const port = process.env.APP_PORT

require('./socket-handler').init(http)

mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) {
        return console.error(err)
    }

    console.log("Connected to mongodb")
})

// serve static file
app.use(express.static('public'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/api/auth', require('./controller/AuthController'))

app.use(require('./middleware/ParseJWTHeader'))

app.use('/api/logs', require('./controller/ActionController'))

http.listen(port, () => console.log(`App listening on port ${port}!`))