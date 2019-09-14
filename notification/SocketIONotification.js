const socketio = require('../socket-handler')

module.exports = {
    async send(action) {
        //send event to via socketio
        socketio.emit('new-action', action)
    },
}


