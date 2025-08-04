const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Attach userId and full user object
      req.userId = decoded.id;
      req.user = decoded;

      return next();
    } catch (error) {
      console.error("JWT verify failed:", error);
      return res.status(401).json({ error: "Invalid token" });
    }
  }

  return res.status(401).json({ error: "No token provided" });
};

module.exports = protect;
