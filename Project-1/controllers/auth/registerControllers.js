import Joi from "joi";
import CustomErrorHandler from "../../services/CustomeErrorHandler";
import JwtService from "../../services/JWTservice";
import { User, RefreshToken } from "../../models";
import bcrypt from "bcrypt";
import { REFRESH_SECRET } from "../../config";

const registerControllers = {
  async register(req, res, next) {
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      confirmPassword: Joi.ref("password"),
    });
    // console.log(req.body);
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
      // throw error;
      // res.json({
      //   msg: "Something bad happened!",
      // });
    }
    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExists(
            "This email is already taken.Please try a different email!"
          )
        );
      }
    } catch (error) {
      return next(error);
    }

    const { name, email, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // prepare the model

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    let accessToken;
    let refresh_Token;
    try {
      const result = await user.save();
      console.log(result);
      // token
      accessToken = JwtService.sign({ _id: result._id, role: result.role });
      refresh_Token = JwtService.sign(
        { _id: result._id, role: result.role },
        "1y",
        REFRESH_SECRET
      );
      //  database whitelist
      await RefreshToken.create({ token: refresh_Token });
    } catch (error) {
      return next(error);
    }
    res.json({
      msg: "Hello form registerController!",
      accessToken: accessToken,
      refreshToken: refresh_Token,
    });
  },
};
export default registerControllers;
