import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notificatioin'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const [errorFlag, setErrorFlag] = useState(false)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUsesrJSON = window.localStorage.getItem('loggedUser')
    if (loggedUsesrJSON) {
      const user = JSON.parse(loggedUsesrJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (e) {
      console.error('Async error:', e)
      setErrorFlag(true)
      setNotification('wrong username or password')
      setTimeout(() => {
        setNotification('')
        setErrorFlag(false)
      }, 5000)

    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')

    setUser(null)
  }

  const handleCreate = async (newBlog) => {
    try {
      createBlogRef.current.toggleVisibility()
      const createdBlog = await blogService.create(newBlog)
      const newBlogs = blogs.concat(createdBlog)
      console.log(createdBlog)

      setBlogs(newBlogs)
      setNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      setTimeout(() => {
        setNotification('')
      }, 5000)


    } catch (error) {
      console.error('Async error:', error)
    }

  }

  const handleLike = async (blog) => {
    const updated = { ...blog, likes: blog.likes + 1 }
    const saved = await blogService.update(blog.id, updated)
    setBlogs(blogs.map(b => (b.id === blog.id ? saved : b)).sort((a, b) => b.likes - a.likes))
  }

  const handleRemove = async (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (!ok) return

    await blogService.remove(blog.id)
    setBlogs(blogs.filter(b => b.id !== blog.id))
  }

  const loginForm = () => {
    return (
      <div>

        <h2>log in to application</h2>
        <Notification errorFlag={errorFlag} message={notification}/>

        <form onSubmit={handleLogin}>
          <div>
            <label>
            username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
            password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  const blogList = (username) => {
    return (
      <div>
        <h2>blogs</h2>
        <Notification errorFlag={errorFlag} message={notification}/>
        <p>{username} logged in<button onClick={handleLogout}>logout</button></p>
        {createBlog()}

        {
          blogs.map(blog =>
            <Blog key={blog.id} blog={blog} currentUser={username} onLike={handleLike} onRemove={handleRemove}/>
          )
        }
      </div>
    )
  }

  const createBlogRef = useRef()

  const createBlog = () => {
    return (
      <div>
        <Togglable buttonLabel="create new blog" hideLabel="cancel" ref={createBlogRef}>
          <BlogForm
            createBlog={handleCreate}
          />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <div>
          {blogList(user.name)}
        </div>
      )}

    </div>
  )
}

export default App
