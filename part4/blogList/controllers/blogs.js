const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
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

  const populated = await savedBlog.populate("user")
  response.status(201).json(populated)

})

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const targetId = request.params.id
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: "userId missing or not valid" })
  }

  const blog = await Blog.findById(targetId)

  if (!blog) {
    return response.status(204).end()
  }

  if (blog.user.toString() !== user._id.toString()){
    return response.status(403).json({ error: "user not authorized" })
  } 

  user.blogs = user.blogs.filter(b => b.id.toString() !== blog.id.toString())

  await blog.deleteOne()
  response.status(204).end()

})

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body
  
  const targetId = request.params.id

  const targetBlog = await Blog.findById(targetId)
  if (!targetBlog) {
    return response.status(404).end()
  }

  targetBlog.title = title
  targetBlog.author = author
  targetBlog.url = url
  targetBlog.likes = likes
  
  const updatedBlog = await targetBlog.save()
  await updatedBlog.populate("user")
  response.status(200).json(updatedBlog)

})

module.exports = blogsRouter
