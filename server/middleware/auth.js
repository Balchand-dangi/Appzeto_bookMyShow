const jwt = require('jsonwebtoken');

/**
 * authenticate — verifies JWT from Authorization: Bearer header
 * Attaches req.user = { id, email, role }
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired. Please log in again.' });
        }
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

/**
 * authorize(...roles) — role guard middleware factory
 * Usage: authorize('admin') or authorize('admin', 'user')
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Requires role: ${roles.join(' or ')}.`,
            });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
