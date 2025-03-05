const express = require("express");
const router = express.Router();
const db = require("../database");
const middleware = require("../middleware");
const {validatePaperInput, validateAuthorInput} = require("../middleware");

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

      const authors = await db.getAllAuthors(req.query);

      return res.status(200).json(authors);
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

    const id = parseInt(req.params.id);
    const author = await db.getAuthorById(id);

    if (!author) {
      return res.status(404).json({
        error: "Author not found"
      })
    }

    return res.status(200).json(author);
  } catch (error) {
    next(error);
  }
});

// POST /api/authors
router.post("/", async (req, res, next) => {
  try {
    //
    // 1. Validate request body using middleware.validateAuthorInput
    //
    // 2. If validation fails, return 400 with error messages
    //
    // 3. Call db.createAuthor
    //
    // 4. Send JSON response with status 201:
    //    res.status(201).json(author);

    const errors = validateAuthorInput(req.body);

    if (errors.length > 0) {
      return res
          .status(400)
          .json({ error: "Validation Error", messages: errors })
    }

    const author = await db.createAuthor(req.body);

    res.status(201).json(author);
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

    const id = parseInt(req.params.id);
    const errors = validateAuthorInput(req.body);

    if (errors.length > 0) {
      return res
          .status(400)
          .json({ error: "Validation Error", messages: errors })
    }

    const author = await db.getAuthorById(id);

    if (!author) {
      return res.status(404).json({
        error: "Author not found"
      })
    }

    const updated_author = await db.updateAuthor(id, req.body);

    res.status(200).json(updated_author);
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

    const id = parseInt(req.params.id);

    const author = await db.getAuthorById(id);

    if (!author) {
      return res.status(404).json({
        error: "Author not found"
      })
    }

    await db.deleteAuthor(id);

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
