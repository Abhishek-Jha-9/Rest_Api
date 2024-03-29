class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }

  static alreadyExists(message) {
    return new CustomErrorHandler(409, message);
  }
  static wrongCredentials(message = "Incorrect username or password!") {
    return new CustomErrorHandler(401, message);
  }
  static unAuthorize(message = "unAuthorize!") {
    return new CustomErrorHandler(401, message);
  }
  static notFound(message = "404 Not Found!") {
    return new CustomErrorHandler(404, message);
  }
  static serverError(message = "Something went wrong with server!") {
    return new CustomErrorHandler(500, message);
  }
}

export default CustomErrorHandler;
