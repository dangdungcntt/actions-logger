const notification = require("../notification");

const handle = async (action) => {
    notification.send(action);
};

module.exports = {
    handle,
};
