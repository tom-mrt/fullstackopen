const jwt = require('jsonwebtoken');

const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require('../models/user');
const { userExtractor } = require('../utils/middleware');



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate("user")
  response.json(blogs)
})


blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: "userId missing or not valid" })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: "titleとurlは必須です"})
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)

})

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const targetId = request.params.id
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: "userId missing or not valid" })
  }

  const blog = await Blog.findById(targetId)

  if (blog.user.toString() === user._id.toString()){
    await Blog.findByIdAndDelete(targetId)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: "無効なユーザーです"})
  }

})

blogsRouter.put("/:id", async (request, response) => {
  const targetId = request.params.id
  const newLikes = request.body.likes
  console.log(newLikes)

  const targetBlog = await Blog.findById(targetId)
  if (!targetBlog) {
    return response.status(404).end()
  }

  targetBlog.likes = newLikes
  
  const updatedBlog = await targetBlog.save()
  response.status(200).json(updatedBlog)

})

module.exports = blogsRouter
