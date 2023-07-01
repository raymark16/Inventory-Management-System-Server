const jwt = require('jsonwebtoken')

const checkAuth = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).send({ message: "Unauthorized" })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized, invalid token" })
        } else {
            req.user = decoded;
            next();
        }
    })
}

module.exports = { checkAuth }