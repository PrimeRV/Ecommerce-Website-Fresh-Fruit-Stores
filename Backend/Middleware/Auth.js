const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(403).json({ 
            success: false, 
            message: 'Unauthorized, JWT token is required' 
        });
    }
    
    try {
        const token = auth.split(' ')[1]; // Bearer token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ 
            success: false, 
            message: 'Unauthorized, JWT token wrong or expired' 
        });
    }
};

module.exports = ensureAuthenticated;