import { useState } from 'react'

const Blog = ({ blog, currentUser, onLike, onRemove }) => {
  const [visible, setVisible] = useState(false)
  const isOriginal = currentUser === blog.user.username
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const removeButtonStyle = {
    backgroundColor: 'blue',
    color: 'white',
    display: isOriginal ? "" : "none"
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.user.username}<button onClick={() => setVisible(true)}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.user.username}<button onClick={() => setVisible(false)}>hide</button><br/>
        {blog.url}<br />
      likes {blog.likes} <button onClick={() => onLike(blog)}>like</button><br />
        {blog.author} <br />
        <button onClick={() => onRemove(blog)} style={removeButtonStyle}>remove</button>
      </div>

    </div>
  )
}

export default Blog