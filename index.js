const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = require("./models");

require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig");

// Routers
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

db.sequelize.sync().then(() => {
  app.listen(process.env.DB_PORT, () => {
    console.log(`Server running on port ${process.env.DB_PORT}`);
  });
});
