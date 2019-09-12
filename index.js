require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const app = express()
const mongodbUri = process.env.MONGODB_URI
const port = process.env.APP_PORT

const Action = require('./model/Action')

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

app.use(require('./controller/AuthController'))

app.use(function (req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_KEY, function (err, decode) {
            if (err) req.user = undefined
            else req.user = decode
            next()
        })
    } else {
        req.user = undefined
        next()
    }
})

app.use(function (req, res, next) {
    if (req.user) {
        return next();
    }
    return res.status(401).json({ error: 'Unauthenticated' });
})

app.get('/api/logs', async (req, res) => {

    let limit = !req.query.limit || req.query.limit > 50 || req.query.limit < 1 ? 5 : req.query.limit

    let query = {}

    if (req.query.last_id) {
        query.id = {
            $lt: req.query.last_id
        }
    }

    if (req.query.q) {
        query.$or = [
            { "text": new RegExp(`${req.query.q}`, 'i') },
            { $text: { $search: req.query.q } }
        ]
    }

    let logs = await Action.find(query).sort({ id: -1 }).limit(limit)

    res.json({
        data: logs,
    })
})

app.post('/api/logs', async (req, res) => {
    let { text } = req.body

    if (!text) {
        return res.status(400).json({
            error: '"text" field is required.'
        })
    }

    res.json({
        data: await new Action({
            text,
            author: req.user.username
        }).save()
    })
})

app.listen(port, () => console.log(`App listening on port ${port}!`))