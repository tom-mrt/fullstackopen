const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const { isValidObjectId } = require('mongoose');
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql')
const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');
const { Subscription } = require('../graphql_demo/resolvers');

const resolvers = {
  Query: {
    authorCount: async () => await Author.collection.countDocuments().exec(),
    bookCount: async () => await Book.collection.countDocuments().exec(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate("author")
      }
      if (!args.author) {
        return await Book.find({ genres: args.genre }).populate("author").exec()
      }

      const author = await Author.findOne({ name: args.author }).exec()
      if (!author) {
        throw new GraphQLError("author not found", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        })
      }
      
      if (!args.genre) {
        return await Book.find({ author: author._id.toString() }).populate("author").exec()
      }
      return await Book.find({ author: author._id.toString(), genres: args.genre}).populate("author").exec()
    },
    allAuthors: async () => {
      const [authors, counts] = await Promise.all([
        Author.find({}).lean(),
        Book.aggregate([{
          $group: {
            _id: "$author",
            count: { $sum: 1 },
          }
        }])
      ])

      const map = new Map(counts.map(c => 
        [String(c._id), c.count]
      ))

      return authors.map(a => {
        return { ...a, id: a._id, bookCount: map.get(String(a._id)) ?? 0 }
      })


    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  // Author: {
  //   bookCount: async (root) => {
  //     return await Book.countDocuments({ author: root.id}).exec()
  //   }
  // },
  Mutation: {
    addBook: async (root, args) => {
      if (args.title.length <= 3) {
        throw new GraphQLError("title length needs to be more than 4 characters.", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        })
      }

      try {
        console.log("before author update");
        
        const author = await Author.findOneAndUpdate(
          { name: args.author },
          { $setOnInsert: { name: args.author } },
          { upsert: true, new: true }
        )
        console.log("after author update");
        

        const book = await Book.create({ ...args, author: author._id })
        console.log("after create");
        const createdBook = book.populate("author")
        
        pubsub.publish("BOOK_ADDED", { bookAdded: createdBook })
        return createdBook
      } catch (e) {
        throw new GraphQLError("saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            error: e.message
          }
        })
      }
      
    },
    deleteBook: async (root, { id }) => {
      const doc = await Book.findByIdAndDelete(id).exec()
      if (!doc) {
        return { success: false, error: "NOT_FOUND"}
      }
      return { success: true, deletedId: doc._id.toString(), book: doc}
    },
    deleteBooksByAuthor: async (root, { authorId }) => {
      if (!isValidObjectId(authorId)) {
        return { success: false, deletedCount: 0, authorId }
      }
      const ids = await Book.find({ author: authorId }).select("_id").lean()
      const res = await Book.deleteMany({ author: authorId }).exec()
      return { success: true, deletedCount: res.deletedCount, authorId, deletedIds: ids.map(x => x._id.toString())}
    },
    addAuthor: async (root, args) => {
      if (args.born < 0) {
        throw new GraphQLError("born needs to be positive.", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        })
      }

      const newAuthor = new Author({ name: args.name, born: args.born })
      try {
        await newAuthor.save()
      } catch(e) {
        throw new GraphQLError("saving author failed", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        })
      }
      return newAuthor
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo
      
      await author.save()
      return author
    },
    createUser: async (root, args) => {
      const user = await User.create({ ...args })
      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED")
    }
  }
}

module.exports = resolvers