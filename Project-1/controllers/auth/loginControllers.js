import Joi from "joi";
import errorHandler from "../../middlewares/errorHandler";
import { User, RefreshToken } from "../../models";
import CustomErrorHandler from "../../services/CustomeErrorHandler";
import bcrypt from "bcrypt";
import JwtService from "../../services/JWTservice";
import { REFRESH_SECRET } from "../../config";
// import RefreshToken from "../../models";

const loginControllers = {
  async login(req, res, next) {
    // validate

    const loginSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });

    // const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      // compare the password
      const matchPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!matchPassword) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      // geneterate token if username and password matched
      const accessToken = JwtService.sign({
        _id: user._id,
        role: user.role,
      });
      const refresh_Token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );
      //  database whitelist
      await RefreshToken.create({ token: refresh_Token });
      res.json({ accessToken, refresh_Token });
    } catch (error) {
      return next(error);
    }
    // return "hello";
  },
  async logout(req, res, next) {
    try {
      // validate before delete
      const refreshSchema = Joi.object({
        refresh_Token: Joi.string().required(),
      });

      const { error } = refreshSchema.validate(req.body);

      if (error) {
        return next(error);
      }
      await RefreshToken.deleteOne({ token: req.body.refresh_Token });
    } catch (error) {
      return next(new Error("Something went wrong in the  database"));
    }
    res.json({ message: "logout Successful!" });
  },
};
export default loginControllers;
