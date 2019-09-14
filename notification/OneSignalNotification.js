const httpClient = require('phin')

const oneSignalAppId = process.env.ONESIGNAL_APP_ID
const oneSingalSegment = process.env.ONESIGNAL_SEGMENT
const oneSignalRestApiKey = process.env.ONESIGNAL_REST_API_KEY
const oneSignalIconUrl = process.env.ONESIGNAL_ICON_URL
const oneSignalImageUrl = process.env.ONESIGNAL_IMAGE_URL

const appUrl = process.env.APP_URL

module.exports = {
    async send(action) {
        if (! oneSignalRestApiKey) {
            console.error(`Invalid OneSignal API key, ignoring notification`)
        }

        //Push to subscribed user via OneSignal
        await httpClient({
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
}