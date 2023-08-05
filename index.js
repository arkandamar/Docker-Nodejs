const express = require("express");
const mongoose = require("mongoose");
const {
  MONGO_USER,
  MONGO_PASS,
  MONGO_IP,
  MONGO_PORT,
} = require("./config/config");

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connect = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    // refer mongodb container ip address by service name in docker compose
    .then(() => console.log("successfully connected to DB"))
    .catch((e) => {
      console.log(e);
      // if error occured retry connect to mongo
      setTimeout(connect, 500);
    });
};

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h2>yak begitulah ya ges</h2>");
});

// localhost:3000/api/v1/post
app.use("/api/v1/post", postRouter);

// localhost:3000/api/v1/user
app.use("/api/v1/user", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
