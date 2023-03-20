const db = require("../db/connection");
const winston = require("winston");
const url = require('url');

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "logs/server.log",
      level: "info",
    }),
  ],
});

exports.createShortenedURL = async (req, res) => {
  logger.info(` ---- api/shorten called. ${req.body}`);
  try {
    const org_url = req.body.url;
    if (!org_url) {
      logger.error("URL is required.");
      return res.status(400).json({ status: "failed", error: "URL is required." });
    }

    // Validate URL
    const parsedUrl = url.parse(org_url);
    if (!parsedUrl.protocol || !parsedUrl.hostname) {
      logger.error("Invalid URL format.");
      return res.status(400).json({ status: "failed", error: "Invalid URL format." });
    }
      
    // Check if the url has shortened before, if yes return the value.
    const obj = await checkIfExist("org_url", org_url);
    if (obj.length > 0) {
      logger.info(`Returning shortened URL for ${org_url}`);
      return res
        .status(200)
        .send({ status: "success", data: obj[0].shortened_url });
    } 

    // Else generate a 7 char shortened url, and check if exist in db.
    let shortened_url = "";
    let cond = true;
    do {
      shortened_url = generateShortId();
      const ifIdExist = await checkIfExist("shortened_url", shortened_url);
      if (ifIdExist.length === 0) {
        cond = false;
      }
    } while (cond);

    // Insert the shortened url to db
    const result = await insertShortenUrls(org_url, shortened_url);
    logger.info(`Inserted new shortened URL for ${org_url}`);
    logger.info(result);
    return res.status(201).send({ status: "success", data: shortened_url });
  } catch (error) {
    logger.error(`Error while inserting shortened URL: ${error}`);
    return res
      .status(500)
      .send({ status: "failed", error: "Internal server error" });
  }
};

exports.getShortenedURL = (req, res) => {
  logger.info(`---- api/:url/getshortenurl called. ${req.params}`);
  const url = req.params.url;
  const query =
    "SELECT org_url, shortened_url FROM urls WHERE shortened_url = ?";
  const values = [url];

  try {
    db.query(query, values, (err, results) => {
      if (err) {
        logger.error(`Error while retrieving shortened URL: ${err}`);
        return res
          .status(500)
          .send({ status: "failed", error: "Internal server error" });
      } 

      if (results && results.length > 0) {
        logger.info(`Returning shortened URL for ${url}`);
        return res.status(200).send({ status: "success", data: results[0] });
      }

      logger.info(`Shortened URL ${url} not found`);
      return res.status(404).send({
        status: "failed",
        error: "The requested URL does not exist.",
      });
    });
  } catch (error) {
    logger.error(`Error while inserting shortened URL: ${error}`);
    return res
      .status(500)
      .send({ status: "failed", error: "Internal server error" });
  }
};

generateShortId = () => {
  let shortened_url = "";
  const array = "abcdefghijklmnopqrstuvwxyz0123456789"
  for (let i = 0; i < 7; i++) {
    const element = array[i];
    // Generate a random number between 0 to array.length(ex)
    const pos = Math.floor(Math.random() * array.length);
    shortened_url += array.charAt(pos);
  }

  return shortened_url;
};

checkIfExist = (col, value) => {
  const query = `SELECT * FROM urls WHERE ${col} = ?`;
  const values = [value];
  return new Promise((resolved, reject) => {
    db.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolved(results);
    });
  });
};

insertShortenUrls = (org_url, shortened_url) => {
  const query = "INSERT INTO urls (org_url, shortened_url) VALUES (?, ?)";
  const values = [org_url, shortened_url];
  return new Promise((resolved, reject) => {
    db.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolved(results);
    });
  });
}
