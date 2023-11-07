const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0", // or '2.0'
    info: {
      title: "Social media application API Documentation",
      version: "1.0.0",
      description: "API documentation",
    },
  },
  apis: [
    "routes/Users.js",
    "routes/Posts.js",
    "routes/Comments.js",
    "routes/Likes.js",
  ],
  middlewares: [
    "middlewares/AuthMiddleware.js"
  ],

  models: [
    "models/Users.js",
    "models/Posts.js",
    "models/Comments.js",
    "models/Likes.js",
  ],

};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
