import express from "express";
// import "express-async-errors";

async function buildApp() {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  return app;
}

export default buildApp;
