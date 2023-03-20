const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

const allowlist = ["http://localhost:4200"];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  let isDomainAllowed = allowlist.indexOf(req.header("Origin")) !== -1;
  if (isDomainAllowed) {
    // Enable CORS for this request
    corsOptions = { origin: true };
  } else {
    // Disable CORS for this request
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};
app.use(cors(corsOptionsDelegate));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api", require("./routes"));
// route not found middleware
app.use((req, res, next) => {
  res.status(404).send({ status: "failed", error: "Invalid api." });
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = server;
