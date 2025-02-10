const express = require("express");
const router = express.Router();
const paperRoutes = require("./routes/papers");
const authorRoutes = require("./routes/authors");

// This is the main router file that combines all route modules.
// It helps organize routes into separate files for better maintainability.
//
// How it works:
// 1. server.js uses this file as: app.use("/api", routes);
// 2. This file then directs requests to the appropriate route handler:
//    - /api/papers/* → routes/papers.js
//    - /api/authors/* → routes/authors.js
//
// Examples:
// - GET /api/papers → handled by routes/papers.js GET '/'
// - GET /api/papers/1 → handled by routes/papers.js GET '/:id'
// - POST /api/authors → handled by routes/authors.js POST '/'
// - GET /api/authors/1 → handled by routes/authors.js GET '/:id'

// Mount routes
router.use("/papers", paperRoutes);
router.use("/authors", authorRoutes);

module.exports = router;
