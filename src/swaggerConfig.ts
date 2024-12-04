import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TAP Final Project API",
      version: "1.0.0",
      description: "This is the API documentation for our Final Project.",
    },
    servers: [
      {
        url: "https://backend-final-2-m4zr.onrender.com", 
        description: "Development server",
      },
    ],
  },
  apis: [path.join(__dirname, '../api-doc/*.yaml')], // Adjusted path to point to your YAML files
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);