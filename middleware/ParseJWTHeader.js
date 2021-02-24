const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        jwt.verify(
            req.headers.authorization.split(" ")[1],
            process.env.JWT_KEY,
            function (err, decode) {
                if (err) req.user = undefined;
                else req.user = decode;
                next();
            }
        );
    } else {
        req.user = undefined;
        next();
    }
};
