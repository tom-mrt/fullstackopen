import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useMatch
} from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navbar, Nav } from 'react-bootstrap';
import BlogList from './components/Blog'
import BlogDetail from './components/BlogDetail';
import Notification from './components/Notification';
import blogService from './services/blogs'
import loginService from './services/login'
import usersService from './services/users';
import LoginForm from './components/LoginForm';

const App = () => {
  // const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const createBlogRef = useRef()
  const queryClient = useQueryClient()

  useEffect(() => {
    const loggedUsesrJSON = window.localStorage.getItem('loggedUser')
    if (loggedUsesrJSON) {
      const user = JSON.parse(loggedUsesrJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"])
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog))
    }
  })

  const updateMutation = useMutation({
    mutationFn: (updated) => blogService.update(updated.id, updated),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(["blogs"])
      queryClient.setQueryData(["blogs"], blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
    }
  })

  const removeMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (_, id) => {
      const blogs = queryClient.getQueryData(["blogs"]) 
      queryClient.setQueryData(["blogs"], blogs.filter(b => b.id !== id))
    }
  })

  const commentMutation = useMutation({
    mutationFn: (args) => blogService.postComment(args.id, args.postedComment),
    onSuccess: (blogWithComment) => {
      const blogs = queryClient.getQueryData(["blogs"])
      queryClient.setQueryData(["blogs"], blogs.map(b => b.id === blogWithComment.id ? blogWithComment : b))
    }
  })

  const usersResult = useQuery({
    queryKey: ["users"],
    queryFn: usersService.getAll,
    select: (data) => [...data].sort((a, b) => b.blogs.length - a.blogs.length)
  })

  const blogsResult = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    // selectは購読者側のビューで、キャッシュ本体はそのまま
    select: (data) => [...data].sort((a, b) => b.likes - a.likes),
  })

  if (usersResult.isLoading || blogsResult.isLoading) {
    return <div>loading data...</div>
  }

  const users = usersResult.data ?? []
  const blogs = blogsResult.data ?? []
  
  const handleLogin = async (username, password) => {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreate = async (newBlog) => {
    try {
      createBlogRef.current.toggleVisibility()
      newBlogMutation.mutate(newBlog)
    } catch (error) {
      console.error('Async error:', error)
    }

  }

  const handleLike = async (blog) => {
    const updated = { ...blog, likes: blog.likes + 1 }
    updateMutation.mutate(updated)
  }

  const handleRemove = async (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (!ok) return

    removeMutation.mutate(blog.id)
  }

  const handleComment = async (id, postedComment) => {
    console.log(postedComment);
    
    commentMutation.mutate({ id, postedComment })
  };

  const padding = {
    padding: 5
  }

  const UsersList = () => {
    return (
      <div>
        <h2>Users</h2>

        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><Link to={`/users/${u.id}`}>{u.username}</Link></td>
                <td>{u.blogs?.length ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const UserView = () => {
    const id = useParams().id
    const selectedUser = users.filter(u => u.id === id)[0]
    const addedBlogs = selectedUser.blogs ?? []
    
    return (
      <div>
        <h2>{selectedUser.username}</h2>
        <h3>added blogs</h3>
        <ul>
          {addedBlogs.map(b => {
            return (
              <li key={b.id}>
                {b.title}
              </li>
            )
          })}
        </ul>
      </div>
    )
  };

  const Home = () => {
    return (
      <div>
        <h2>blog app</h2>
      </div>
    )
  };

  return (
    <Router>
      <div className='container'>
        <div>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className='me-auto'>
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/users">users</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/blogs">blogs</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                {user
                  ? <em>{user.username} logged in <button onClick={handleLogout}>logout</button></em>
                  : <Link style={padding} to="/login">login</Link>
                }
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          </Navbar>
          
        </div>

        <Home />
        <Notification />
        <Routes>
          <Route path="/login" element={<LoginForm handleLogin={handleLogin} />}/>
          <Route path="/users/:id" element={<UserView />}/>
          <Route path="/users" element={<UsersList />}/>
          <Route path="/blogs" element={user && <BlogList blogs={blogs} username={user.name} handleLike={handleLike} handleRemove={handleRemove} handleCreate={handleCreate} createBlogRef={createBlogRef}/>}/>
          <Route path="/blogs/:id" element={user && <BlogDetail blogs={blogs} handleComment={handleComment} onLike={handleLike} onRemove={handleRemove} />} />
        </Routes>
        {user && (
          <div>
            
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
