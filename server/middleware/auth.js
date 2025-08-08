const jwt = require('jsonwebtoken');

// Middleware for authenticating requests
const auth = (req, res, next) => {
    // Extract token from the request header
    const token = req.header('x-auth-token');

    // Deny access if no token is provided
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Decode the token to get user information
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
