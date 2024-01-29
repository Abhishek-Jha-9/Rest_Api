import Joi from "joi";
import { RefreshToken } from "../../models";
import CustomErrorHandler from "../../services/CustomeErrorHandler";
import JwtService from "../../services/JWTservice";
import { REFRESH_SECRET } from "../../config";
import User from "../../models/user";
const refreshControllers = {
  async refresh(req, res, next) {
    // validate request
    const refreshSchema = Joi.object({
      refresh_Token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    // database validation of refresh_Token
    let refreshtoken;
    try {
      refreshtoken = await RefreshToken.findOne({
        token: req.body.refresh_Token,
      });
      if (!refreshtoken) {
        return next(CustomErrorHandler.unAuthorize("Invalid refresh token"));
      }
      //   verify token
      let userId;
      try {
        const { _id } = await JwtService.validate(
          req.body.refresh_Token,
          REFRESH_SECRET
        );
        userId = _id;
      } catch (error) {
        return next(CustomErrorHandler.unAuthorize("Invalid refresh token"));
      }
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return next(
          CustomErrorHandler.unAuthorize(
            "No user found . Create an account first"
          )
        );
      }
      //   token
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
      return next(new Error("Something went wrong! " + error.message));
    }
  },
};
export default refreshControllers;
