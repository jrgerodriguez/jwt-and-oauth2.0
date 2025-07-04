const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {};
const path = require('path');

Util.checkJWT = (req, res, next) => {
    const token = req.cookies?.jwt

    if(!token) {
        // Send this message in the url so it can be handled by the front end
        return res.redirect('/login.html?alert=login_required')
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.redirect('/login.html')
    }
}

module.exports = Util