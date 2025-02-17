const request = require("supertest");
const app = require("../src/server");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const samplePaper = {
  title: "Sample Paper Title",
  publishedIn: "ICSE 2024",
  year: 2024,
  authors: [
    {
      name: "John Doe",
      email: "john@mail.utoronto.ca",
      affiliation: "University of Toronto",
    },
    {
      name: "Jane Smith",
      email: null,
      affiliation: "University A",
    },
  ],
};

// Clean up before all tests
beforeAll(async () => {
  await prisma.paper.deleteMany();
  await prisma.author.deleteMany();
});

// Clean up after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

describe("API Tests for Paper Routes", () => {
  // POST /api/papers
  describe("POST /api/papers", () => {
    it("should create a new paper with valid input", async () => {
      const res = await request(app).post("/api/papers").send(samplePaper);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        title: samplePaper.title,
        publishedIn: samplePaper.publishedIn,
        year: samplePaper.year,
      });
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("createdAt");
      expect(res.body).toHaveProperty("updatedAt");

      expect(res.body.authors).toHaveLength(samplePaper.authors.length);
      samplePaper.authors.forEach((expectedAuthor) => {
        const foundAuthor = res.body.authors.find(
          (author) => author.name === expectedAuthor.name
        );
        expect(foundAuthor).toBeDefined();
        expect(foundAuthor).toMatchObject({
          name: expectedAuthor.name,
          email: expectedAuthor.email,
          affiliation: expectedAuthor.affiliation,
        });
      });
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/api/papers").send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation Error");
      expect(res.body.messages).toEqual([
        "Title is required",
        "Published venue is required",
        "Published year is required",
        "At least one author is required",
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
      expect(res.body).toHaveProperty("papers");
      expect(Array.isArray(res.body.papers)).toBeTruthy();
      expect(res.body.papers.length).toBeGreaterThan(0);
      res.body.papers.forEach((paper) => {
        expect(paper).toHaveProperty("id");
        expect(paper).toHaveProperty("title");
        expect(paper).toHaveProperty("publishedIn");
        expect(paper).toHaveProperty("year");
        expect(paper).toHaveProperty("createdAt");
        expect(paper).toHaveProperty("updatedAt");
        expect(paper.authors).toBeInstanceOf(Array);
        if (paper.authors.length > 0) {
          expect(paper.authors[0]).toHaveProperty("id");
          expect(paper.authors[0]).toHaveProperty("name");
          expect(paper.authors[0]).toHaveProperty("email");
          expect(paper.authors[0]).toHaveProperty("affiliation");
          expect(paper.authors[0]).toHaveProperty("createdAt");
          expect(paper.authors[0]).toHaveProperty("updatedAt");
        }
      });
    });

    it("should apply filters correctly", async () => {
      const res = await request(app).get(
        "/api/papers?year=2024&publishedIn=ICSE"
      );

      expect(res.status).toBe(200);
      res.body.papers.forEach((paper) => {
        expect(paper.year).toBe(2024);
        expect(paper.publishedIn).toMatch(/ICSE/i);
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
      expect(res.body).toMatchObject(createRes.body);
    });

    it("should return 404 if paper is not found", async () => {
      const res = await request(app).get("/api/papers/999");

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
        publishedIn: "Updated Venue",
        year: 2025,
        authors: [
          {
            name: "Updated Author",
            email: "updated.author@example.com",
            affiliation: "Updated University",
          },
        ],
      };
      const res = await request(app)
        .put(`/api/papers/${createRes.body.id}`)
        .send(updatedPaper);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(updatedPaper);
      expect(res.body).toHaveProperty("updatedAt");
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
