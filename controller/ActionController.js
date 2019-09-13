const express = require('express')
const router = express.Router()
const Action = require('../model/Action')
const NewActionHandler = require('../listener/NewActionListener')


router.use(require('../middleware/AuthMiddleware'))

router.get('/', async (req, res) => {

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

    let actions = await Action.find(query).sort({ id: -1 }).limit(limit)

    res.json({
        data: actions,
    })
})

router.post('/', async (req, res) => {
    let { text } = req.body

    if (!text) {
        return res.status(400).json({
            error: '"text" field is required.'
        })
    }

    let action = await new Action({
        text,
        author: req.user.username
    }).save()

    res.json({
        data: action
    })

    NewActionHandler.handle(action)
})

module.exports = router