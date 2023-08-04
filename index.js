const express = require("express");
const mongoose = require("mongoose");
const {
  MONGO_USER,
  MONGO_PASS,
  MONGO_IP,
  MONGO_PORT,
} = require("./config/config");

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // refer mongodb container ip address by service name in docker compose
  .then(() => console.log("successfully connected to DB"))
  .catch((e) => console.log(e));

app.get("/", (req, res) => {
  res.send("<h2>yak begitulah gais</h2>");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
