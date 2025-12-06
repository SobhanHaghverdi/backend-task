class ClientResponse {
  static notFound(res, message) {
    res.status(404).json({ message, status: 404 });
  }

  static badRequest(res, message) {
    res.status(400).json({ message, status: 400 });
  }

  static success(res, data) {
    const method = res?.req?.method;
    const statusCode = method === "POST" ? 201 : 200;

    res.status(statusCode).json({ ...data, status: statusCode });
  }
}

export default ClientResponse;
