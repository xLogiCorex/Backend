function authorizeRole(roles = []) {
    return (req, res, next) => {
        if (!req.user.role) {
            return res.status(403).json({ message: "Hiányzik a szerep a kérésből" });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Nincs jogosultságod" });
        }
        next();
    };
}

module.exports = authorizeRole