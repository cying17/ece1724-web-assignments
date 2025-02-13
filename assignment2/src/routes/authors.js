const express = require("express");
const router = express.Router();
const db = require("../database");
const middleware = require("../middleware");

// GET /api/authors
router.get(
  "/",
  middleware.validateAuthorQueryParams,
  async (req, res, next) => {
    try {
      // TODO: Implement GET /api/authors
      //
      // 1. Extract query parameters:
      //    - name (optional)
      //    - affiliation (optional)
      //    - limit (optional, default: 10)
      //    - offset (optional, default: 0)
      //
      // 2. Call db.getAllAuthors with filters
      //
      // 3. Send JSON response with status 200:
      //    res.json({
      //      authors,  // Array of authors with their papers
      //      total,    // Total number of authors matching filters
      //      limit,    // Current page size
      //      offset    // Current page offset
      //    });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/authors/:id
router.get("/:id", middleware.validateResourceId, async (req, res, next) => {
  try {
    // TODO: Implement GET /api/authors/:id
    //
    // 1. Get author ID from req.params
    //
    // 2. Call db.getAuthorById
    //
    // 3. If author not found, return 404
    //
    // 4. Send JSON response with status 200:
    //    res.json(author);
  } catch (error) {
    next(error);
  }
});

// POST /api/authors
router.post("/", async (req, res, next) => {
  try {
    // TODO: Implement POST /api/authors
    //
    // 1. Validate request body using middleware.validateAuthorInput
    //
    // 2. If validation fails, return 400 with error messages
    //
    // 3. Call db.createAuthor
    //
    // 4. Send JSON response with status 201:
    //    res.status(201).json(author);
  } catch (error) {
    next(error);
  }
});

// PUT /api/authors/:id
router.put("/:id", middleware.validateResourceId, async (req, res, next) => {
  try {
    // TODO: Implement PUT /api/authors/:id
    //
    // 1. Get author ID from req.params
    //
    // 2. Validate request body using middleware.validateAuthorInput
    //
    // 3. If validation fails, return 400 with error messages
    //
    // 4. Call db.updateAuthor
    //
    // 5. If author not found, return 404
    //
    // 6. Send JSON response with status 200:
    //    res.json(author);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/authors/:id
router.delete("/:id", middleware.validateResourceId, async (req, res, next) => {
  try {
    // TODO: Implement DELETE /api/authors/:id
    //
    // 1. Get author ID from req.params
    //
    // 2. Call db.deleteAuthor
    //
    // 3. If author not found, return 404
    //
    // 4. If author is the sole author of any papers, return 400:
    //    {
    //      "error": "Constraint Error",
    //      "message": "Cannot delete author: they are the only author of one or more papers"
    //    }
    //
    // 5. Send no content response with status 204:
    //    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
