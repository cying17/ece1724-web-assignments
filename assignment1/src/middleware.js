// Request logger middleware
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

// Validate paper input
const validatePaper = (paper) => {
  // TODO: Implement paper validation
  // Return an array of error messages, empty array if validation passes
  //
  // Required fields validation:
  // - title: non-empty string
  // - authors: non-empty string
  // - published_in: non-empty string
  // - year: integer greater than 1900
  //
  // Error message format should match the handout, for example:
  // - "Title is required"
  // - "Authors are required"
  // - "Published venue is required"
  // - "Published year is required"
  // - "Valid year after 1900 is required"
  const errors = [];

  return errors;
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // TODO: Implement error handling
  // Hint: Return errors in these exact formats as specified in the handout:
  //
  // 1. Validation Errors (400):
  // {
  //   "error": "Validation Error",
  //   "messages": ["Title is required", "Valid year after 1900 is required"]
  // }
  //
  // 2. Not Found Error (404):
  // {
  //   "error": "Paper not found"
  // }
  //
  // 3. Invalid Query Parameter (400):
  // {
  //   "error": "Validation Error",
  //   "message": "Invalid query parameter format"
  // }
  //
  // Remember to:
  // - Log errors for debugging (console.error)
  // - Send appropriate status codes (400, 404)
  console.error(err);
};

// Validate ID parameter middleware
const validateId = (req, res, next) => {
  // TODO: Implement ID validation
  //
  // If ID is invalid, return:
  // Status: 400
  // {
  //   "error": "Validation Error",
  //   "message": "Invalid ID format"
  // }
  //
  // If valid, call next()
};

module.exports = {
  requestLogger,
  validatePaper,
  errorHandler,
  validateId,
};
