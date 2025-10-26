import { useState, useContext } from 'react'
import NotifyContext from '../NotifyContext';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const { notificationDispatch } = useContext(NotifyContext)

  const addBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title,
      author,
      url
    }

    await createBlog(newBlog)
    notificationDispatch({ type: "notify", payload: `a new blog ${newBlog.title} by ${newBlog.author} added` })
    setTimeout(() => {
        notificationDispatch({ type: "clear" })
      }, 5000)

    setTitle('')
    setAuthor('')
    setUrl('')
  }


  return (
    <>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          <label>
            title:
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>

    </>
  )
}

export default BlogForm
