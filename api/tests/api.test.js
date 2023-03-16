const request = require("supertest");
const db = require("../db/connection");
const app = require("../server");

describe("Shortened URL API", () => {
  let server = app;
  let org_url = "http://www.testurl.com";
  afterAll(async () => {
    await db.query(`DELETE FROM urls WHERE org_url = '${org_url}'`);
    db.end();
    server.close();
  });

  describe("POST /api/shorten", () => {
    it("returns a shortened URL for a valid URL", async () => {
      const res = await request(app)
        .post("/api/shorten")
        .send({ url: "www.google.com" })
        .expect(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toBeDefined();
    });

    it("returns an error for a missing URL parameter", async () => {
      const res = await request(app).post("/api/shorten").expect(400);
      expect(res.body.error).toBe("Missing URL parameter");
    });
  });

  describe("GET /api/:url/getshortenurl", () => {
    it("returns the original URL for a valid shortened URL", async () => {
      // Create a test record in the database
      const shortened_url = "abcdefg";
      const query = "INSERT INTO urls (org_url, shortened_url) VALUES (?, ?)";
      const values = [org_url, shortened_url];
      await db.query(query, values);

      const res = await request(app)
        .get(`/api/${shortened_url}/getshortenurl`)
        .expect(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.org_url).toBe(org_url);
      expect(res.body.data.shortened_url).toBe(shortened_url);
    });

    it("returns an error for an invalid shortened URL", async () => {
      const res = await request(app)
        .get("/api/invalid/getshortenurl")
        .expect(404);
      expect(res.body.error).toBe("Shortened URL not found");
    });
  });
});
