const httpClient = require('phin')
const socketio = require('../socket-handler')

const oneSignalAppId = process.env.ONESIGNAL_APP_ID
const oneSingalSegment = process.env.ONESIGNAL_SEGMENT
const oneSignalRestApiKey = process.env.ONESIGNAL_REST_API_KEY
const oneSignalIconUrl = process.env.ONESIGNAL_ICON_URL
const oneSignalImageUrl = process.env.ONESIGNAL_IMAGE_URL

const appUrl = process.env.APP_URL

const handle = async (action) => {
    //send event to via socketio
    socketio.emit('new-action', action)

    //Push to subscribed user via OneSignal
    httpClient({
        url: 'https://onesignal.com/api/v1/notifications',
        method: 'POST',
        headers: {
            'Authorization': `Basic ${oneSignalRestApiKey}`
        },
        data: {
            app_id: `${oneSignalAppId}`,
            contents: {
                en: `${action.text}`
            },
            headings: {
                en: `${action.author} added new action`
            },
            included_segments: [oneSingalSegment],
            url: `${appUrl}/#${action.id}`,
            chrome_web_icon: oneSignalIconUrl,
            chrome_web_image: oneSignalImageUrl,
            firefox_icon: oneSignalImageUrl
        }
    })
}

module.exports = {
    handle
}