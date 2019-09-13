const socketio = require('../socket-handler')

const handle = (action) => {
    socketio.emit('new-action', action)
}

module.exports = {
    handle
}