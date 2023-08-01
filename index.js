const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("<h2>kenapa tu ges yak, keren dah</h2>");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));