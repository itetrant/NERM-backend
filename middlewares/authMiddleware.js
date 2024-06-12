const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
//const asyncHandler = require("express-async-handler");

const authMiddleware = async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer ")) {

    try {

        token = req?.headers?.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        req.user = user;
        return next();

    } catch (error) {
        return res.json({
            status: "fail",
            message: error.message,
        });
    }
    
  } else {
        return res.json({
            status: "fail",
            message: "Missing authorization",
        });
  }
};

const isAdmin = async (req, res, next) => {
      if (req?.user?.role.startsWith("admin")) {
        return next(); 
      } else {
            const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
            res.status(statuscode);
            return res.json({
                status: "fail",
                message: "You are not Admin",
            });
      }
  };

module.exports = { authMiddleware, isAdmin };