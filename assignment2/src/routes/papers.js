const express = require("express");
const router = express.Router();
const db = require("../database");
const middleware = require("../middleware");

// GET /api/papers
router.get("/", middleware.validatePaperQueryParams, async (req, res, next) => {
  try {
    // TODO: Implement GET /api/papers
    //
    // 1. Extract query parameters:
    //    - year (optional)
    //    - publishedIn (optional)
    //    - author (optional)
    //    - limit (optional, default: 10)
    //    - offset (optional, default: 0)
    //
    // 2. Call db.getAllPapers with filters
    //
    // 3. Send JSON response with status 200:
    //    res.json({
    //      papers,  // Array of papers with their authors
    //      total,   // Total number of papers matching filters
    //      limit,   // Current page size
    //      offset   // Current page offset
    //    });
  } catch (error) {
    next(error);
  }
});

// GET /api/papers/:id
router.get("/:id", middleware.validateResourceId, async (req, res, next) => {
  try {
    // TODO: Implement GET /api/papers/:id
    //
    // 1. Get paper ID from req.params
    //
    // 2. Call db.getPaperById
    //
    // 3. If paper not found, return 404
    //
    // 4. Send JSON response with status 200:
    //    res.json(paper);
  } catch (error) {
    next(error);
  }
});

// POST /api/papers
router.post("/", async (req, res, next) => {
  try {
    // TODO: Implement POST /api/papers
    //
    // 1. Validate request body using middleware.validatePaperInput
    //
    // 2. If validation fails, return 400 with error messages
    //
    // 3. Call db.createPaper
    //
    // 4. Send JSON response with status 201:
    //    res.status(201).json(paper);
  } catch (error) {
    next(error);
  }
});

// PUT /api/papers/:id
router.put("/:id", middleware.validateResourceId, async (req, res, next) => {
  try {
    // TODO: Implement PUT /api/papers/:id
    //
    // 1. Get paper ID from req.params
    //
    // 2. Validate request body using middleware.validatePaperInput
    //
    // 3. If validation fails, return 400 with error messages
    //
    // 4. Call db.updatePaper
    //
    // 5. If paper not found, return 404
    //
    // 6. Send JSON response with status 200:
    //    res.json(paper);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/papers/:id
router.delete("/:id", middleware.validateResourceId, async (req, res, next) => {
  try {
    // TODO: Implement DELETE /api/papers/:id
    //
    // 1. Get paper ID from req.params
    //
    // 2. Call db.deletePaper
    //
    // 3. If paper not found, return 404
    //
    // 4. Send no content response with status 204:
    //    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
