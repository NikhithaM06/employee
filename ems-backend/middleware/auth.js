const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const header = req.header('Authorization');
  const token = header?.startsWith('Bearer ')
    ? header.replace('Bearer ', '')
    : undefined;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = (req, res, next) => {
  if (!req.user?.role) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { auth, adminAuth };
