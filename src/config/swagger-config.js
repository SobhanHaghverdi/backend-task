import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerConfig = swaggerJSDoc({
  swaggerDefinition: {
    openapi: "3.1.0",
    info: {
      version: "1.0.0",
      title: "Behtech Backend Task",
      description: "Backend position task",
      contact: { name: "Sobhan Haghverdi", email: "sobhanhv.dev@gmail.com" },
    },
  },
  apis: [path.join(process.cwd(), "src/modules/**/*-swagger.js")],
});

export default swaggerConfig;
