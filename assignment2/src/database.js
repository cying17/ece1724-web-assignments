const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// TODO: Implement these database operations
const dbOperations = {
  createPaper: async (paperData) => {
    try {
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

      const authorIds = [];
      const addedAuthorIds = new Set();

      for (const authorData of paperData.authors) {
        let {name, email = null, affiliation = null} = authorData;

        let author = await prisma.author.findFirst({
          where: {name, email, affiliation},
          orderBy: {id: "asc"},
        });

        if (!author) {
          author = await prisma.author.create({
            data: {name, email, affiliation}
          })
        }

        if (!addedAuthorIds.has(author.id)) {
          authorIds.push(author.id);
          addedAuthorIds.add(author.id);
        }
      }

      const paper = await prisma.paper.create({
        data: {
          title: paperData.title,
          publishedIn: paperData.publishedIn,
          year: paperData.year,
          authors: {
            connect: authorIds.map(id => ({ id }))
          }
        },
        include: {
          authors: true
        }
      });

      return paper;

    } catch (error) {
      throw error;
    }
  },

  getAllPapers: async (filters = {}) => {
    try {
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

      const { year, publishedIn, author, limit = 10, offset = 0 } = filters;
      const where = {};

      if (year) {
        where.year = year;
      }

      if (publishedIn) {
        where.publishedIn = {
            contains: publishedIn,
            mode: 'insensitive',
        }
      }

      if (author) {
        const authorFilters = Array.isArray(author) ? author: [author];
        where.AND = authorFilters.map((authorName) => ({
          authors: {
            some: {
              name: {
                contains: authorName,
                mode: 'insensitive',
              },
            },
          },
        }));
      }

      const total = await prisma.paper.count({ where });

      const papers = await prisma.paper.findMany({
        where,
        include: {
          authors: true
        },
        take: limit,
        skip: offset,
        orderBy: {id: "asc"},
      });

      return { papers, total, limit, offset };

    } catch (error) {
      throw error;
    }
  },

  getPaperById: async (id) => {
    try {
      //
      // Use await prisma.paper.findUnique()
      // Include authors in the response
      // Return null if not found

      const paper = await prisma.paper.findUnique({
        where: { id },
        include: {
          authors: true
        }
      });

      return paper;
    } catch (error) {
      throw error;
    }
  },

  updatePaper: async (id, paperData) => {
    try {
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

      const authorIds = [];
      const addedAuthorIds = new Set();

      for (const authorData of paperData.authors) {
        let {name, email = null, affiliation = null} = authorData;

        let author = await prisma.author.findFirst({
          where: {name, email, affiliation},
          orderBy: {id: "asc"},
        });

        if (!author) {
          author = await prisma.author.create({
            data: {name, email, affiliation}
          })
        }

        if (!addedAuthorIds.has(author.id)) {
          authorIds.push(author.id);
          addedAuthorIds.add(author.id);
        }
      }

      const paper = await prisma.paper.update({
        data: {
          title: paperData.title,
          publishedIn: paperData.publishedIn,
          year: paperData.year,
          authors: {
            set: [],
            connect: authorIds.map(authorId => ({ id: authorId }))
          }
        },
        where: { id },
        include: {
          authors: true
        }
      });

      return paper;
    } catch (error) {
      throw error;
    }
  },

  deletePaper: async (id) => {
    try {
      //
      // Use await prisma.paper.delete()
      // Return nothing (undefined)

      await prisma.paper.delete({
        where: { id },
      });

    } catch (error) {
      throw error;
    }
  },

  // Author Operations
  createAuthor: async (authorData) => {
    try {
      //
      // authorData includes:
      // - name: string
      // - email: string (optional)
      // - affiliation: string (optional)
      //
      // Use await prisma.author.create()
      // Return the created author

      const author = await prisma.author.create({
        data: {
          name: authorData.name,
          email: authorData.email,
          affiliation: authorData.affiliation
        },
        include: {
          papers: true
        }
      })

      return author;

    } catch (error) {
      throw error;
    }
  },

  getAllAuthors: async (filters = {}) => {
    try {
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

      const { name, affiliation, limit = 10, offset = 0 } = filters;
      const where = {};

      if (name) {
        where.name = {
          contains: name,
          mode: 'insensitive',
        }
      }

      if (affiliation) {
        where.affiliation = {
          contains: affiliation,
          mode: 'insensitive',
        }
      }

      const total = await prisma.author.count({ where });

      const authors = await prisma.author.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: {id: "asc"},
        include: {
          papers: true
        }
      });

      return { authors, total, limit, offset };
    } catch (error) {
      throw error;
    }
  },

  getAuthorById: async (id) => {
    try {
      //
      // Use await prisma.author.findUnique()
      // Include papers in the response
      // Return null if not found

      const author = await prisma.author.findUnique({
        where: { id },
        include: {
          papers: true
        }
      });

      return author;
    } catch (error) {
      throw error;
    }
  },

  updateAuthor: async (id, authorData) => {
    try {
      //
      // Use await prisma.author.update()
      // Return updated author with papers

      const author = await prisma.author.update({
        data: {
          name: authorData.name,
          email: authorData.email,
          affiliation: authorData.affiliation
        },
        where: { id },
        include: {
          papers: true
        }
      });

      return author;
    } catch (error) {
      throw error;
    }
  },

  deleteAuthor: async (id) => {
    try {
      //
      // First check if author is sole author of any papers
      // If yes, throw error
      // If no, delete author
      // Use await prisma.author.delete()

      let papers = await prisma.paper.findMany({
        where: {
          authors: {
            some: { id }
          }
        },
        include: {
          authors: true
        },
        orderBy: {id: "asc"},
      });

      for (const paper of papers) {
        if (paper.authors.length === 1) {
          const error = new Error("Constraint Error");
          error.type = "constraint";
          error.messages = "Cannot delete author: they are the only author of one or more papers";

          throw error;
        }
      }

      await prisma.author.delete({
        where: { id },
      });

    } catch (error) {
      throw error;
    }
  },
};

module.exports = {
  ...dbOperations,
};
