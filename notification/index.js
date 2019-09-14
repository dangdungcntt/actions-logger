const notifications = {
    'slack': require('./SlackNotification'),
    'socketio': require('./SocketIONotification'),
    'onesignal': require('./OneSignalNotification')
}

module.exports = {
    send(action, methods) {
        if (! methods) {
            methods = Object.keys(notifications)
        }

        methods.forEach(noti => {
            if (notifications[noti]) {
                notifications[noti].send(action)
            }
        })
    }
}