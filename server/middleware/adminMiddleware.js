// middleware/adminMiddleware.js

const isAdmin = (req, res, next) => {
  // Check if user exists (protect middleware must run before this)
  if (!req.user) {
    return res.status(401).json({
      message: "Not authenticated. Please login."
    });
  }

  // Check role
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only."
    });
  }

  // If admin → allow access
  next();
};

module.exports = { isAdmin };
