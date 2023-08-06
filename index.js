const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis").default;
const cors = require("cors");
const {
  MONGO_USER,
  MONGO_PASS,
  MONGO_IP,
  MONGO_PORT,
  SESSION_SECRET,
  REDIS_URL,
  REDIS_PORT,
} = require("./config/config");

// initialize client
let redisClient = redis.createClient({
  socket: {
    host: REDIS_URL,
    port: REDIS_PORT,
  },
});

// import routes
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

// server
const app = express();
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

// call client redis
(async () => {
  await redisClient.connect();
})();

redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});

redisClient.on("connect", function (err) {
  console.log("Connected to redis successfully");
});

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

// middleware
app.enable("trust proxy");
app.use(cors());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/v1/", (req, res) => {
  res.send("<h2>yak begitulah ya ges</h2>");
  console.log("yeah it ran");
});

// localhost:3000/api/v1/post
app.use("/api/v1/post", postRouter);

// localhost:3000/api/v1/user
app.use("/api/v1/user", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
