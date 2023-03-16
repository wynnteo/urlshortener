const mysql = require("mysql");
let connection = null;

connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "urlshortener",
});

connection.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("Connected to database successfully!");
  }
});

module.exports = connection;
