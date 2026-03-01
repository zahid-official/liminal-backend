// AppError Function
class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;

    // Use the provided stack trace if available, otherwise capture it
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
