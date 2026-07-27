/**
 * Ensure the request has a valid authenticated user
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {boolean|string} [matchUserId] - Optional ownership check:
 *   - `true`: verify req.user.userId === req.params.userId
 *   - a string: verify req.user.userId === that value (e.g. a userId read
 *     from req.body/req.query, for routes where the target isn't a URL param)
 *   - omitted/false: only verify a token is present, no ownership check
 * @returns {boolean} true if auth passes, false if it already sent a response
 */
export function authorized(req, res, matchUserId = false) {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized: missing token" });
    return false;
  }

  if (matchUserId === false) {
    return true; // authorized, no ownership check requested
  }

  const targetUserId = matchUserId === true ? req.params.userId : matchUserId;
  if (req.user.userId !== targetUserId) {
    res.status(403).json({ message: "Forbidden: user mismatch" });
    return false;
  }

  return true; // authorized
}
