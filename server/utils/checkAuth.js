import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyJWT = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.accessToken)
    return res.status(401).json({ message: "Unauthorized" });
  if (cookies.accessToken) {
    const token = cookies.accessToken;
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ email: decode.UserInfo.email });
      if (!user) {
        return res.json({ success: false, message: "1unauthorized access!" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.json({ success: false, message: "2unauthorized access!" });
      }
      if (error.name === "TokenExpiredError") {
        return res.json({
          success: false,
          message: "sesson expired try sign in!",
        });
      }
      res.json({ success: false, message: "Internal server error!" });
    }
  } else {
    // console.log(req.headers)
    res.json({ success: false, message: "3unauthorized access!" });
  }
};
