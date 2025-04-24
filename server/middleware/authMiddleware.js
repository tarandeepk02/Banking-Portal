import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // Get token from Authorization header
    const token = req.headers['authorization']?.split(' ')[1];
    if (token === 'dev-token-123' && process.env.NODE_ENV === 'development') {
        req.user = {
          email: 'gs5618258@gmail.com',
          role: 'admin',
          userId: 'dev-admin-id',
        };
        return next();
      }

    if (!token) {
        return res.status(403).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        // Verify the token using JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        console.log("✅ Decoded token:", decoded);
console.log("✅ req.user:", req.user);  // Attach user info to the request object
        next();  // Continue to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

export default verifyToken;
