const db = require("../db/connection");

exports.createShortenedURL = async (req, res) => {
  try {
    const org_url = req.body.url;
    if (!org_url) {
      res.status(400).json({ error: "Missing URL parameter" });
      return;
    }

    // Check if the url has shortened before, if yes return the value.
    const obj = await checkIfExist("org_url", org_url);
    if (obj.length > 0) {
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
    const query = "INSERT INTO urls (org_url, shortened_url) VALUES (?, ?)";
    const values = [org_url, shortened_url];
    db.query(query, values, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send({ status: "failed", error: "Internal server error" });
      } else {
        return res.status(200).send({ status: "success", data: shortened_url });
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: "failed", error: "Internal server error" });
  }
};

generateShortId = () => {
  let shortened_url = "";
  const array = "abcdefghijklmnopqrstuvwxyz0123456789";
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

exports.getShortenedURL = (req, res) => {
  const url = req.params.url;
  const query =
    "SELECT org_url, shortened_url FROM urls WHERE shortened_url = ?";
  const values = [url];
  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error looking up URL in database:", err);
      return res
        .status(500)
        .send({ status: "failed", error: "Internal server error" });
    } else if (results.length === 0) {
      return res.status(404).send({
        status: "failed",
        error: "Shortened URL not found",
      });
    } else {
      return res.status(200).send({ status: "success", data: results[0] });
    }
  });
};
