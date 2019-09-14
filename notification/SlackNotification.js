const { WebClient } = require('@slack/web-api')

const token = process.env.SLACK_TOKEN
const channel = process.env.SLACK_CHANNEL_ID
const threadTs = process.env.SLACK_THREAD_TS
let web = undefined

if (token) {
    web = new WebClient(token)
}

module.exports = {
    async send(action) {
        if (! web) {
            console.error(`Invalid slack token, ignoring notification`)
        }
        
        await web.chat.postMessage({
            channel: channel,
            text: `${action.author} added new action: \`\`\`${action.text}\`\`\``,
            thread_ts: threadTs
        })
    },
}


