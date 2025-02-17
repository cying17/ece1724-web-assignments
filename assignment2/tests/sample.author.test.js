const request = require("supertest");
const app = require("../src/server");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const sampleAuthor = {
  name: "John Doe",
  email: "john.doe@example.com",
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

describe("API Tests for Author Routes", () => {
  // POST /api/authors
  describe("POST /api/authors", () => {
    it("should create a new author with valid input", async () => {
      const res = await request(app).post("/api/authors").send(sampleAuthor);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(sampleAuthor);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("createdAt");
      expect(res.body).toHaveProperty("updatedAt");
      expect(res.body).toHaveProperty("papers");
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/api/authors").send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation Error");
      expect(res.body.messages).toEqual(["Name is required"]);
    });
  });

  // GET /api/authors
  describe("GET /api/authors", () => {
    it("should retrieve a list of authors with correct response structure", async () => {
      const res = await request(app).get("/api/authors");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("authors");
      expect(res.body).toHaveProperty("total");
      expect(res.body).toHaveProperty("limit");
      expect(res.body).toHaveProperty("offset");

      expect(Array.isArray(res.body.authors)).toBeTruthy();
      expect(typeof res.body.total).toBe("number");
      expect(typeof res.body.limit).toBe("number");
      expect(typeof res.body.offset).toBe("number");
    });

    it("should filter authors by case-insensitive partial name match", async () => {
      const res = await request(app).get("/api/authors?name=jOh");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("authors");
      expect(Array.isArray(res.body.authors)).toBeTruthy();
      expect(res.body.authors.length).toBeGreaterThan(0);

      // Verify that all returned authors contain "jOh" (case-insensitive) in their name
      res.body.authors.forEach((author) => {
        expect(author.name.toLowerCase()).toContain("joh");
      });
    });
  });

  // GET /api/authors/:id
  describe("GET /api/authors/:id", () => {
    it("should retrieve an author by ID", async () => {
      const createRes = await request(app)
        .post("/api/authors")
        .send(sampleAuthor);
      const res = await request(app).get(`/api/authors/${createRes.body.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(createRes.body);
    });

    it("should return 404 if author is not found", async () => {
      const res = await request(app).get("/api/authors/99999");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Author not found");
    });
  });

  // PUT /api/authors/:id
  describe("PUT /api/authors/:id", () => {
    it("should update an existing author", async () => {
      const createRes = await request(app)
        .post("/api/authors")
        .send(sampleAuthor);
      const updatedAuthor = {
        name: "Updated Author",
        email: "updated.author@example.com",
        affiliation: "Updated University",
      };
      const res = await request(app)
        .put(`/api/authors/${createRes.body.id}`)
        .send(updatedAuthor);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(updatedAuthor);
      expect(res.body).toHaveProperty("updatedAt");
    });

    it("should return 404 if author is not found", async () => {
      const res = await request(app)
        .put("/api/authors/99999")
        .send(sampleAuthor);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Author not found");
    });
  });

  // DELETE /api/authors/:id
  describe("DELETE /api/authors/:id", () => {
    it("should delete an author by ID", async () => {
      const createRes = await request(app)
        .post("/api/authors")
        .send(sampleAuthor);
      const res = await request(app).delete(
        `/api/authors/${createRes.body.id}`
      );

      expect(res.status).toBe(204);

      const getRes = await request(app).get(
        `/api/authors/${createRes.body.id}`
      );
      expect(getRes.status).toBe(404);
    });

    it("should return 404 if author is not found", async () => {
      const res = await request(app).delete("/api/authors/99999");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Author not found");
    });
  });
});
