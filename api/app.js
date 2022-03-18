const express = require("express");
const cors = require("cors");
const app = express();
const port = 8800;
const authRouter = require("./routes/auth");
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
//app.use(cors);

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Express server listening on: " + port);
});

module.exports = app;
