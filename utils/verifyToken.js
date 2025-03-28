import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken; // Get token from cookies

  if (!token) {
    return res.status(401).json({ success: false, message: "You are not authorized." });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Token is invalid." });
    }

    req.user = user; // Attach user data to request
    next();
  });
};

// Middleware to verify user authentication
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.role === "admin") {
      next();
    } else {
      return res.status(401).json({ success: false, message: "You are not authenticated." });
    }
  });
};

// Middleware to verify admin access
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      return res.status(401).json({ success: false, message: "You are not authorized." });
    }
  });
};
