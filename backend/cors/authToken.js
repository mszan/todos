const authToken = require("jsonwebtoken")

function generateAccessToken(user) {
    // 5 minutes expiration.
    return authToken.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "5 min"})
}

function generateRefreshToken(user) {
    // 5 days expiration.
    return authToken.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "5 days"})
}

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    authToken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err){
            console.log(err)
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}

module.exports = {generateAccessToken, generateRefreshToken, authenticate}