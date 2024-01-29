import { DEBUG_MODE } from "../config";

import { ValidationError } from "joi";
import CustomErrorHandler from "../services/CustomeErrorHandler";

const errorHandler = (error, req, res, next) => {
  let statusCode = 500;

  let data = {
    message: "Internal server error from errorHandler.js file!",
    ...(DEBUG_MODE === "true" && {
      originalError: error.message,
      msg: "here!",
    }),
  };

  if (error instanceof ValidationError) {
    statusCode = 422;
    data = {
      message: error.message,
    };
  }
  if (error instanceof CustomErrorHandler) {
    statusCode = error.status;
    data = {
      message: error.message,
    };
  }
  res.status(statusCode).json(data);
};
export default errorHandler;
