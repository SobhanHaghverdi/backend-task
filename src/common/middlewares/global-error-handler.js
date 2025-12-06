function globalErrorHandler(error, req, res, next) {
  let message = "";

  if (error?.messages) {
    message = `${error?.messages[0]?.rule} - ${error?.messages[0]?.message}`;
  } else {
    message = error?.message || "Server error";
  }

  const data = { body: req.body, query: req.query };
  const status = error?.status || 500;

  res.error = {
    message,
    callStack: error?.stack,
    type: status === 422 ? "validation" : "unhandled",
  };

  console.log(error);

  return res.status(status).json({
    message,
    data,
  });
}

export default globalErrorHandler;
