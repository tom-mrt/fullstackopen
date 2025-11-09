const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub()

const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Person = require('./models/person')
const User = require('./models/user')

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) {
        return Person.find({}).populate("friendOf")
      }
      
      return Person.find({ phone: { $exists: args.phone === "YES"}})
        .populate("friendOf")
    },
    findPerson: async (root, args) =>
      Person.findOne({ name: args.name }),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Person: {
    address: ({ street, city }) => {
      return {
        street,
        city,
      }
    },
    // friendOf: async (root) => {
    //   const friends = await User.find({
    //     friends: {
    //       // 配列にroot._idを含むものを選ぶ。$in: 内包
    //       $in: [root._id]
    //     }
    //   })
    //   return friends
    // }
  },
  Mutation: {
    addPerson: async (root, args, context) => {
      const person = new Person({ ...args })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        })
      }

      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      } catch (e) {
        throw new GraphQLError("saving person failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            e
          }
        })
      }

      pubsub.publish("PERSON_ADDED", { personAdded: person })

      return person
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone

      try {
        await person.save()
      } catch (e) {
        throw new GraphQLError("saving number failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            e
          }
        })
      }
      return person
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username })

      return user.save()
        .catch(error => {
          throw new GraphQLError("creating the user failed", {
            extensions: {
              code: "BAD_USER_INPUT"
            }
          })
        })
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

     return { value: jwt.sign(userForToken, process.env.JWT_SECRET )}
    },
    addAsFriend: async (root, args, { currentUser }) => {
      const isFriend = (person) => currentUser.friends.map(f => f._id.toString()).includes(person._id.toString())

      if (!currentUser) {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" }
        })
      }

      const person = await Person.findOne({ name: args.name })
      if (!isFriend(person)) {
        currentUser.friends = currentUser.friends.concat(person)
      }

      await currentUser.save()

      return currentUser
    }
  },
  Subscription: {
    personAdded: {
      // 教材ではasyncIteratorになっているが、graphql-subscriptions ^3.0系ではapi名が変わっている
      subscribe: () => pubsub.asyncIterableIterator("PERSON_ADDED")
    }
  }
}

module.exports = resolvers