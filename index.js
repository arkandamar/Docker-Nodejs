const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb://arkan:arkan@mongo:27017/?authSource=admin")
  // refer mongodb container ip address by service name in docker compose
  .then(() => console.log("successfully connected to DB"))
  .catch((e) => console.log(e));

app.get("/", (req, res) => {
  res.send("<h2>yak begitulah gais</h2>");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
