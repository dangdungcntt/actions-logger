require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongodbUri = process.env.MONGODB_URI
const port = process.env.APP_PORT

const Log = require('./model/Log')


mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) {
        return console.error(err)
    }

    console.log("Connected to mongodb");
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// serve static file
app.use(express.static('public'))

app.get('/api/logs', async (req, res) => {

    let limit = !req.query.limit || req.query.limit > 50 || req.query.limit < 1 ? 5 : req.query.limit

    let query = {};

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

    console.log(query)

    let logs = await Log.find(query).sort({ id: -1 }).limit(limit)

    res.json({
        data: logs,
    })
})

app.post('/api/logs', async (req, res) => {
    let { text } = req.body

    if (! text) {
        return res.status(400).json({
            error: '"text" field is required.'
        })
    }

    res.json({
        data: await new Log({
            text,
            created_at: new Date(),
            modified_at: new Date()
        }).save()
    })
})

app.listen(port, () => console.log(`App listening on port ${port}!`))