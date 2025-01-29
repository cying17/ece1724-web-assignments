const request = require("supertest");
const app = require("../src/server");
const { db } = require("../src/database");

const samplePaper = {
  title: "Sample Paper Title",
  authors: "John Doe, Jane Smith",
  published_in: "ICSE 2024",
  year: 2024,
};

// Clean up before all tests
beforeAll(async () => {
  await new Promise((resolve, reject) => {
    db.run("DELETE FROM papers", (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
});

// Clean up after all tests
afterAll(async () => {
  await new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
});

describe("Paper Management API Tests", () => {
  // POST /api/papers
  describe("POST /api/papers", () => {
    it("should create a new paper with valid input", async () => {
      const res = await request(app).post("/api/papers").send(samplePaper);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        title: samplePaper.title,
        authors: samplePaper.authors,
        published_in: samplePaper.published_in,
        year: samplePaper.year,
      });
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("created_at");
      expect(res.body).toHaveProperty("updated_at");
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/api/papers").send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation Error");
      expect(res.body.messages).toEqual([
        "Title is required",
        "Authors are required",
        "Published venue is required",
        "Published year is required",
      ]);
    });

    it("should return 400 if year is invalid", async () => {
      const res = await request(app)
        .post("/api/papers")
        .send({ ...samplePaper, year: 1900 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation Error");
      expect(res.body.messages).toEqual(["Valid year after 1900 is required"]);
    });
  });

  // GET /api/papers
  describe("GET /api/papers", () => {
    it("should retrieve a list of papers", async () => {
      const res = await request(app).get("/api/papers");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it("should apply filters correctly", async () => {
      const res = await request(app).get(
        "/api/papers?year=2024&published_in=ICSE"
      );

      expect(res.status).toBe(200);
      res.body.forEach((paper) => {
        expect(paper.year).toBe(2024);
        expect(paper.published_in).toMatch(/ICSE/i);
      });
    });
  });

  // GET /api/papers/:id
  describe("GET /api/papers/:id", () => {
    it("should retrieve a paper by ID", async () => {
      const createRes = await request(app)
        .post("/api/papers")
        .send(samplePaper);
      const res = await request(app).get(`/api/papers/${createRes.body.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        ...createRes.body,
        created_at: res.body.created_at,
        updated_at: res.body.updated_at,
      });
    });

    it("should return 404 if paper is not found", async () => {
      const res = await request(app).get("/api/papers/99999");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Paper not found");
    });
  });

  // PUT /api/papers/:id
  describe("PUT /api/papers/:id", () => {
    it("should update an existing paper", async () => {
      const createRes = await request(app)
        .post("/api/papers")
        .send(samplePaper);
      const updatedPaper = {
        title: "Updated Title",
        authors: "Updated Author",
        published_in: "Updated Venue",
        year: 2025,
      };
      const res = await request(app)
        .put(`/api/papers/${createRes.body.id}`)
        .send(updatedPaper);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(updatedPaper);
      expect(res.body).toHaveProperty("updated_at");
    });

    it("should return 404 if paper is not found", async () => {
      const res = await request(app).put("/api/papers/99999").send(samplePaper);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Paper not found");
    });
  });

  // DELETE /api/papers/:id
  describe("DELETE /api/papers/:id", () => {
    it("should delete a paper by ID", async () => {
      const createRes = await request(app)
        .post("/api/papers")
        .send(samplePaper);
      const res = await request(app).delete(`/api/papers/${createRes.body.id}`);

      expect(res.status).toBe(204);

      const getRes = await request(app).get(`/api/papers/${createRes.body.id}`);
      expect(getRes.status).toBe(404);
    });

    it("should return 404 if paper is not found", async () => {
      const res = await request(app).delete("/api/papers/99999");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Paper not found");
    });
  });
});
