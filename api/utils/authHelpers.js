/**
 * Ensure the request has a valid authenticated user
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {boolean} [matchParamId] - Optional: verify req.user.id === req.params.id
 * @returns {boolean} true if auth passes, false if it already sent a response
 */
export function authorized(req, res, matchParamId = false) {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized: missing token" });
    return false;
  }

  const userId = req.params.id || req.params.userId;
  if (matchParamId && req.user.id !== userId) {
    res.status(403).json({ message: "Forbidden: user mismatch" });
    return false;
  }

  return true; // authorized
}
