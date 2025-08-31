const JWT = require('jsonwebtoken')
const SECRET = process.env.SECRET

function authenticateJWT() {
    return (req, res, next) => {
        const authHeader = req.headers.authorization
        if (!authHeader)
            return res.status(401).json({ message: 'Hiányzó token!' })

        const tokenParts = authHeader.split(' ');
        if (tokenParts[0] !== 'Bearer' || !tokenParts[1])
            return res.status(401).json({ message: 'Hibás token formátum' });

        try {
            const decodedToken = JWT.verify(tokenParts[1], SECRET)
            req.user = {
                email: decodedToken.email,
                role: decodedToken.role,
                id: decodedToken.id
            }
            next()
        }
        catch (error) {
            return res.status(401).json({ message: 'Érvénytelen token!', error: error.message })
        }
    }
}

module.exports = authenticateJWT