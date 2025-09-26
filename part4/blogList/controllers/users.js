const usersRouter = require("express").Router()
const bcrypt = require('bcrypt');
const User = require("../models/user")

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate("blogs")
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || !password) {
    return response.status(400).json({ error: "username and password required"})
  }

  if (password.length < 3 || username.length < 3) {
    return response.status(400).json({ error: "ユーザー名、パスワードの長さは3文字以上にしてください" })
  }

  const hash = await bcrypt.hash(password, 10);
  const newUser = new User({ username, name, password: hash })
  const savedUser = await newUser.save()
  response.status(201).json(savedUser)

})

module.exports = usersRouter