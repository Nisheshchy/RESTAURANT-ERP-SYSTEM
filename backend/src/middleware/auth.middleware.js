const jwt = require("jsonwebtoken");

/**
 * protect — verifies JWT and attaches req.user = { id, role }
 * Usage: router.get("/path", protect, handler)
 */
const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

/**
 * allowRoles — restrict route to specific roles
 * Usage: router.delete("/path", protect, allowRoles("admin","manager"), handler)
 */
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires role: ${roles.join(" or ")}`,
      });
    }
    next();
  };
};

module.exports = { protect, allowRoles };
