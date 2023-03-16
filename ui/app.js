const express = require("express");
var path = require("path");
const port = process.env.PORT || 4200;
const app = express();

//Set the base path to the angular-test dist folder
app.use(express.static(path.join(__dirname, "./dist/ui")));

//Any routes will be redirected to the angular app
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./dist/ui/index.html"));
});

app.listen(port, () => {
  console.log("URL Shortener Application Started!");
  console.log(port);
});
