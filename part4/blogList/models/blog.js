const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: true})

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: { 
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  comments: {
    type: [commentSchema],
    default: []
  }
})

commentSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog