import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const create = async (newblog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newblog, config)
  return response.data
}

const update = async (id, newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${id}`, newBlog, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

const postComment = async (id, postedComment) => {
  const newComment = {
    "content": postedComment
  }
  console.log(postedComment);
  
  const response = await axios.post(`${baseUrl}/${id}/comments`, newComment)
  return response.data
}

export default { getAll, create, update, remove, setToken, postComment }
