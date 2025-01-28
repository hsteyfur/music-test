const requireAuth = async (req, res, next) => {
  try {
    // Check if user is authenticated via session
    if (!req.session.access_token) {
      return res.status(401).json({ error: "Unauthorized - No token" });
    }

    // Add token to request for controllers to use
    req.user = {
      id: req.session.user_id,
      access_token: req.session.access_token,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = { requireAuth };
