import User from "../models/user";
import CustomErrorHandler from "../services/CustomeErrorHandler";

const admin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (user.role === "admin") {
      // console.log("inside try of  admin.js");
      next();
    } else {
      return next(CustomErrorHandler.unAuthorize());
    }
  } catch (error) {
    console.log("inside admin.js");
    return next(CustomErrorHandler.serverError());
  }
};

export default admin;
