const jwt = require('jsonwebtoken');

const verifyUser = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "No authorization, no token" });
    }
    // console.log("Cookies:", req.cookies);
    // console.log("Auth Header:", req.headers.authorization);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ message: "Token verification failed", error: err.message });
  }
};

module.exports = verifyUser;
