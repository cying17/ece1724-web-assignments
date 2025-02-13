const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// TODO: Implement these database operations
const dbOperations = {
  createPaper: async (paperData) => {
    try {
      // TODO: Implement paper creation
      //
      // paperData includes:
      // - title: string
      // - publishedIn: string
      // - year: number
      // - authors: array of author objects
      //   each author has:
      //   - name: string
      //   - email: string (optional)
      //   - affiliation: string (optional)
      //
      // Steps:
      // 1. For each author in paperData.authors:
      //    - First try to find an existing author with matching name, email, and affiliation
      //    - If not found, create a new author
      // 2. Create the paper and connect it with the authors
      // 3. Make sure to include authors in the response
      //
      // Hint: Use prisma.author.findFirst() to find existing authors
      // and prisma.paper.create() with { connect: [...] } to connect authors
    } catch (error) {
      throw error;
    }
  },

  getAllPapers: async (filters = {}) => {
    try {
      // TODO: Implement getting all papers with filters
      //
      // filters can include:
      // - year: number
      // - publishedIn: string (partial match)
      // - author: string (partial match)
      // - limit: number (default: 10)
      // - offset: number (default: 0)
      //
      // Use await prisma.paper.findMany()
      // Include authors in the response
      // Return { papers, total, limit, offset }
    } catch (error) {
      throw error;
    }
  },

  getPaperById: async (id) => {
    try {
      // TODO: Implement getting paper by ID
      //
      // Use await prisma.paper.findUnique()
      // Include authors in the response
      // Return null if not found
    } catch (error) {
      throw error;
    }
  },

  updatePaper: async (id, paperData) => {
    try {
      // TODO: Implement paper update
      //
      // paperData includes:
      // - title: string
      // - publishedIn: string
      // - year: number
      // - authors: array of author objects
      //   each author has:
      //   - name: string
      //   - email: string (optional)
      //   - affiliation: string (optional)
      //
      // Steps:
      // 1. For each author in paperData.authors:
      //    - First try to find an existing author with matching name, email, and affiliation
      //    - If not found, create a new author
      // 2. Update the paper with new field values
      // 3. Replace all author relationships with the new set of authors
      // 4. Make sure to include authors in the response
      //
      // Hint: Use prisma.author.findFirst() to find existing authors
      // and prisma.paper.update() with authors: { set: [], connect: [...] }
      // to replace author relationships
    } catch (error) {
      throw error;
    }
  },

  deletePaper: async (id) => {
    try {
      // TODO: Implement paper deletion
      //
      // Use await prisma.paper.delete()
      // Return nothing (undefined)
    } catch (error) {
      throw error;
    }
  },

  // Author Operations
  createAuthor: async (authorData) => {
    try {
      // TODO: Implement author creation
      //
      // authorData includes:
      // - name: string
      // - email: string (optional)
      // - affiliation: string (optional)
      //
      // Use await prisma.author.create()
      // Return the created author
    } catch (error) {
      throw error;
    }
  },

  getAllAuthors: async (filters = {}) => {
    try {
      // TODO: Implement getting all authors with filters
      //
      // filters can include:
      // - name: string (partial match)
      // - affiliation: string (partial match)
      // - limit: number (default: 10)
      // - offset: number (default: 0)
      //
      // Use await prisma.author.findMany()
      // Include papers in the response
      // Return { authors, total, limit, offset }
    } catch (error) {
      throw error;
    }
  },

  getAuthorById: async (id) => {
    try {
      // TODO: Implement getting author by ID
      //
      // Use await prisma.author.findUnique()
      // Include papers in the response
      // Return null if not found
    } catch (error) {
      throw error;
    }
  },

  updateAuthor: async (id, authorData) => {
    try {
      // TODO: Implement author update
      //
      // Use await prisma.author.update()
      // Return updated author with papers
    } catch (error) {
      throw error;
    }
  },

  deleteAuthor: async (id) => {
    try {
      // TODO: Implement author deletion
      //
      // First check if author is sole author of any papers
      // If yes, throw error
      // If no, delete author
      // Use await prisma.author.delete()
    } catch (error) {
      throw error;
    }
  },
};

module.exports = {
  ...dbOperations,
};
