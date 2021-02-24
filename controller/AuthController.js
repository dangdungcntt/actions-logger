const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const User = require("../model/User");

router.post("/login", async (req, res) => {
    let { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: `"username" and "password" are required`,
        });
    }

    let user = await User.findOne({ username });

    if (!user || !user.comparePassword(password)) {
        return res.status(401).json({
            error: "Unauthenticated",
        });
    }

    return res.json({
        token: jwt.sign({ username }, process.env.JWT_KEY, {
            expiresIn: process.env.JWT_TTL,
        }),
    });
});

router.post("/register", async (req, res) => {
    let { username, password, token } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: `"username" and "password" are required`,
        });
    }

    if (token != process.env.ADMIN_TOKEN) {
        return res.status(401).json({
            error: "Unauthenticated",
        });
    }

    let user = await new User({
        username,
        password,
    }).save();

    if (!user) {
        return res.status(500).json({
            error: "An error occured",
        });
    }

    return res.json({
        message: `Created ${username}`,
    });
});

module.exports = router;
