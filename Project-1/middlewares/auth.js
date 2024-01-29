import user from "../models/user";
import CustomErrorHandler from "../services/CustomeErrorHandler";
import JwtService from "../services/JWTservice";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("thus !");
    return next(CustomErrorHandler.unAuthorize());
  }
  const token = authHeader.split(" ")[1];
  //   console.log(token);
  try {
    const { _id, role } = JwtService.validate(token);
    const user = {
      _id,
      role,
    };
    // console.log("herr");
    req.user = user;
    next();
  } catch (error) {
    console.log("this !");
    return next(CustomErrorHandler.unAuthorize());
  }
};

export default auth;
