import crypto from "crypto";

export function setXsrfCookie(req, res, next) {
  if (!req.cookies["XSRF-TOKEN"]) {
    const xsrfToken = crypto.randomBytes(32).toString("hex");

    res.cookie("XSRF-TOKEN", xsrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // or 'strict' — 'lax' is usually safer in dev
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 24h,
      domain: process.env.APP_DOMAIN || undefined,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[XSRF] Set new XSRF-TOKEN cookie");
    }
  }

  next();
}

export function validateXsrf(req, res, next) {
  // Skip safe methods
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const cookieToken = req.cookies["XSRF-TOKEN"];
  const headerToken = req.headers["x-xsrf-token"];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[XSRF] Invalid or missing token", {
        hasCookie: !!cookieToken,
        hasHeader: !!headerToken,
        match: cookieToken === headerToken,
      });
    }

    return res.status(403).json({ message: "Invalid XSRF token" });
  }

  next();
}
