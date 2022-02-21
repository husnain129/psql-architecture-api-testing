require("dotenv").config();
const app = require("./src/app.js");
const pool = require("./src/pool");

const PORT = process.env.PORT || 3005;

pool
  .connect({
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
  })
  .then(() => {
    app().listen(PORT, () => console.log("server is running on port = ", PORT));
  })
  .catch((err) => console.log(err));
