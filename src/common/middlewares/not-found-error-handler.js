function notFoundErrorHandler(req, res, next) {
  return res.status(404).json({
    message: "Api endpoint does not found",
  });
}

export default notFoundErrorHandler;
