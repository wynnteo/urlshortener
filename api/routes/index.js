const express = require("express");
const router = new express.Router();
const controller = require("../js/controller.js");

router.get("/", (req, res) => {
  res.json({ message: "Welcome to URL Shortener API." });
});

router.get("/:url/getshortenurl", controller.getShortenedURL);
router.post("/shorten", controller.createShortenedURL);
module.exports = router;
