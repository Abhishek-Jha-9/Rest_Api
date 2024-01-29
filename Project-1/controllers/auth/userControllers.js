import { User } from "../../models";
import CustomErrorHandler from "../../services/CustomeErrorHandler";
const userControllers = {
  async getUser(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.user._id }).select(
        "-password -createdAt -updatedAt -__v"
      );
      if (!user) {
        // console.log("afaa");
        return next(CustomErrorHandler.notFound());
      }
      res.json(user);
    } catch (error) {
      return next(CustomErrorHandler.notFound());
    }
  },
};

export default userControllers;
