const mongoose = require("mongoose")
const express = require('express')
const blogsRouter = require("./controllers/blogs")
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const { errorHandler, tokenExtractor } = require('./utils/middleware');


const config = require("./utils/config")


const app = express()

mongoose.connect(config.MONGODB_URI)
app.use(express.json())
app.use(tokenExtractor)

app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

app.use(errorHandler)

module.exports = app

