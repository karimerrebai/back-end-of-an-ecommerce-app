const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { success, error } = require("consola");

const DB = require("./Config/db.js");
const PORT = process.env.APP_PORT || 4000;
const DOMAIN = process.env.APP_DOMAIN;
const authRoute = require("./Routers/authenticationRouter");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", authRoute);

app.listen(PORT, async () => {
  try {
    success({
      message: `Server started on PORT ${PORT}` + `URL ${DOMAIN}`,
      badge: true,
    });
  } catch (error) {
    error({ message: "error with " + error.message, badge: true });
  }
});
