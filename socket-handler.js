const jwt = require('jsonwebtoken')
const socketio = require('socket.io')
let io = undefined

module.exports = {
    init: (http) => {
        io = socketio(http)

        io.use(function (socket, next) {
            if (socket.handshake.query && socket.handshake.query.token) {
                jwt.verify(socket.handshake.query.token, process.env.JWT_KEY, function (err, decoded) {
                    if (err) return next(new Error('Authentication error'))
        
                    socket.user = decoded
                    next()
                })
            } else {
                next(new Error('Authentication error'))
            }
        })
            .on('connection', function (socket) {
                console.log(`Client connected ${socket.id}`)
            })
    },
    emit: (event, data) => {
        io.emit(event, data)
    }
}


