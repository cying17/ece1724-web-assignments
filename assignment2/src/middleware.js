// Request logger middleware
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

// Validate paper input for Assignment 2
// Note: This is different from Assignment 1 as it handles authors as objects
const validatePaperInput = (paper) => {
  //
  // Required fields:
  // - title: non-empty string
  // - publishedIn: non-empty string
  // - year: integer > 1900
  // - authors: non-empty array of author objects
  //   where each author must have:
  //   - name: required, non-empty string
  //   - email: optional string
  //   - affiliation: optional string
  //
  // Return array of error messages, for example:
  // [
  //   "Title is required",
  //   "Published venue is required",
  //   "Valid year after 1900 is required",
  //   "At least one author is required"
  // ]
  const {title, publishedIn, year, authors} = paper;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push("Title is required");
  }
  if (!publishedIn || typeof publishedIn !== 'string' || publishedIn.trim().length === 0) {
    errors.push("Published venue is required");
  }
  if (!year) {
    errors.push("Published year is required");
  }
  if (year && (!Number.isInteger(Number(year)) || year <= 1900)) {
    errors.push("Valid year after 1900 is required");
  }

  if (!Array.isArray(authors) || authors.length === 0) {
    errors.push("At least one author is required");
  } else {
    for (const author of authors) {
      if (!author.name || typeof author.name !== 'string' || author.name.trim().length === 0) {
        errors.push("Author name is required");
        break;
      }
    }
  }

  return errors;
};

// Validate author input
const validateAuthorInput = (author) => {
  //
  // Required fields:
  // - name: non-empty string
  //
  // Optional fields:
  // - email: string
  // - affiliation: string
  //
  // Return array of error messages, for example:
  // [
  //   "Name is required"
  // ]
  const errors = [];

  if (!author.name || typeof author.name !== 'string' || author.name.trim().length === 0) {
    errors.push("Name is required");
  }

  return errors;
};

// Validate query parameters for papers
const validatePaperQueryParams = (req, res, next) => {
  //
  // Validate:
  // - year: optional, must be integer > 1900 if provided
  //   - Parse string to integer
  //   - Update req.query.year with the parsed value
  // - publishedIn: optional, string
  //   - No parsing needed
  // - author: optional, string
  //   - No parsing needed
  // - limit: optional, must be positive integer <= 100 if provided
  //   - Parse string to integer
  //   - Default to 10 if not provided
  //   - Update req.query.limit with the parsed value
  // - offset: optional, must be non-negative integer if provided
  //   - Parse string to integer
  //   - Default to 0 if not provided
  //   - Update req.query.offset with the parsed value
  //
  // If invalid, return:
  // Status: 400
  // {
  //   "error": "Validation Error",
  //   "message": "Invalid query parameter format"
  // }
  //
  // If valid, call next()

  const {year, publishedIn, author, limit, offset } = req.query;
  let hasError = false;

  if (year) {
    if (!/^\d+$/.test(year)) {
      hasError = true;
    } else {
      const parsedYear = parseInt(year, 10);
      if (isNaN(parsedYear) || parsedYear <= 1900) {
        hasError = true;
      } else {
        req.query.year = parsedYear;
      }
    }
  }

  if (publishedIn && (typeof publishedIn !== 'string' || publishedIn.trim().length === 0)) {
    hasError = true;
  }

  if (author) {
    if (typeof author === 'string') {
      if (author.trim().length === 0) {
        hasError = true;
      }
    } else if (Array.isArray(author)) {
      if (author.length === 0) {
        hasError = true;
      }
      for (const a of author) {
        if (typeof a !== 'string' || a.trim().length === 0) {
          hasError = true;
        }
      }
    } else {
      hasError = true;
    }
  }

  if (limit) {
    if (!/^\d+$/.test(limit)) {
      hasError = true;
    } else {
      const parsedLimit = parseInt(limit, 10);
      if (isNaN(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100) {
        hasError = true;
      } else {
        req.query.limit = parsedLimit;
      }
    }
  }

  if (offset) {
    if (!/^\d+$/.test(offset)) {
      hasError = true;
    } else {
      const parsedOffset = parseInt(offset, 10);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        hasError = true;
      } else {
        req.query.offset = parsedOffset;
      }
    }
  }

  if (hasError) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Invalid query parameter format"
    })
  }

  next()
};

// Validate query parameters for authors
const validateAuthorQueryParams = (req, res, next) => {
  //
  // Validate:
  // - name: optional, string
  // - affiliation: optional, string
  // - limit: optional, must be positive integer <= 100 if provided
  // - offset: optional, must be non-negative integer if provided
  //
  // If invalid, return:
  // Status: 400
  // {
  //   "error": "Validation Error",
  //   "message": "Invalid query parameter format"
  // }
  //
  // If valid, call next()

  const {name, affiliation, limit, offset } = req.query;
  let hasError = false;

  if (name && (typeof name !== 'string' || name.trim().length === 0)) {
    hasError = true;
  }

  if (affiliation && (typeof affiliation !== 'string' || affiliation.trim().length === 0)) {
    hasError = true;
  }

  if (limit) {
    if (!/^\d+$/.test(limit)) {
      hasError = true;
    } else {
      const parsedLimit = parseInt(limit, 10);
      if (isNaN(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100) {
        hasError = true;
      } else {
        req.query.limit = parsedLimit;
      }
    }
  }

  if (offset) {
    if (!/^\d+$/.test(offset)) {
      hasError = true;
    } else {
      const parsedOffset = parseInt(offset, 10);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        hasError = true;
      } else {
        req.query.offset = parsedOffset;
      }
    }
  }

  if (hasError) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Invalid query parameter format"
    })
  }

  next()
};

// Validate resource ID parameter
// Used for both paper and author endpoints
const validateResourceId = (req, res, next) => {
  //
  // If ID is invalid, return:
  // Status: 400
  // {
  //   "error": "Validation Error",
  //   "message": "Invalid ID format"
  // }
  //
  // If valid, call next()

  const id = req.params.id ? Number(req.params.id) : null;

  if (!id || !Number.isInteger(id) || id <= 0) {
    return res
        .status(400)
        .json({
          error: "Validation Error",
          message: "Invalid ID format"
        });
  }

  next();
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.type === 'author_not_found') {
    return res.status(404).json({
      error: "Author not found"
    })
  }

  if (err.type === 'paper_not_found') {
    return res.status(404).json({
      error: "Paper not found"
    })
  }

  if (err.type === 'constraint') {
    return res.status(400).json({
      error: "Constraint Error",
      message: "Cannot delete author: they are the only author of one or more papers"
    })
  }

  return res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

module.exports = {
  requestLogger,
  validatePaperInput,
  validateAuthorInput,
  validatePaperQueryParams,
  validateAuthorQueryParams,
  validateResourceId,
  errorHandler,
};
