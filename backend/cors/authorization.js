const authorization = require("jsonwebtoken")
const pool = require("../db");

function generateAccessToken(payload) {
    // 5 minutes expiration.
    return authorization.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15 min"})
}

function generateRefreshToken(payload) {
    // 5 days expiration.
    return authorization.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "5 days"})
}

async function authenticate(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    authorization.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
        if (err){
            return res.sendStatus(403)
        }
        req.payload = payload

        // Add userId to payload.
        await pool.query("SELECT id FROM users WHERE username = ?", [req.payload.username])
            .then( userId => {
                res.locals.userId = userId[0][0]['id']
            })
        next()
    })
}

module.exports = {generateAccessToken, generateRefreshToken, authenticate}