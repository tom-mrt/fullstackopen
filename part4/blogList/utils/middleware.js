const jwt = require('jsonwebtoken');
const User = require('../models/user');


const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === "MongServerError") {
    return response.status(400).json({ error: error.message })
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invaid "})
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired"
    })
  }
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization")
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.replace("Bearer ", "")
    request.token = token
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: "token missing"})
  }
  const decoded = jwt.verify(request.token, process.env.SECRET)
  if (!decoded.id) return response.status(401).json({ error: "token invalid" })
  
  const user = await User.findById(decoded.id)
  if (!user) return response.status(401).json({ error: "user not found"})
  
  request.user = user

  next()
};




module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor
}