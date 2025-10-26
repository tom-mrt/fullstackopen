import Table from "react-bootstrap/Table"
import { Link } from 'react-router-dom';
import Togglable from './Togglable';
import BlogForm from './BlogForm';

const Blog = ({ blog }) => {
  // const [visible, setVisible] = useState(false)
  // const blogUsername = blog?.user?.username ?? ''
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // const hideWhenVisible = { display: visible ? 'none' : '' }
  // const showWhenVisible = { display: visible ? '' : 'none' }

  return (
      <td>
        <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
      </td>
  )
}


const BlogList = ({ blogs, username, handleLike, handleRemove, handleCreate, createBlogRef }) => {
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
      <div className='container'>
        {createBlog()}
        <Table striped>
          <tbody>
            {
              blogs.map(blog =>
                <tr key={blog.id}>
                  <Blog key={blog.id} blog={blog} currentUser={username} onLike={handleLike} onRemove={handleRemove}/>
                </tr>
              )
            }
          </tbody>

        </Table>


        {/* <BlogView blog={blogs[0]}/> */}
      </div>
    )
};

export default BlogList;