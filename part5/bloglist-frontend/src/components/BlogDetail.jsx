import { useState } from 'react';
import { useParams } from 'react-router-dom';

const BlogDetail = ({blogs, handleComment, onLike, onRemove}) => {
  const [comment, setComment] = useState("");
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)
  const comments = blog?.comments ?? []

  const removeButtonStyle = {
    backgroundColor: 'blue',
    color: 'white',
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(comment);
    
    await handleComment(id, comment)
    setComment("")
  };
  
  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a><br />
    likes {blog.likes} <button onClick={() => onLike(blog)}>like</button><br />
      added by {blog.user.username} <br />
      <button onClick={() => onRemove(blog)} style={removeButtonStyle}>remove</button>
      <h3>comments</h3>
      <form onSubmit={handleSubmit}>
        <input
           type="text" 
           value={comment} 
           onChange={({target}) => setComment(target.value)}
           />
        <button type='submit'>add comment</button>
      </form>
      <ul>
        {comments.map(c => {
          return (
            <li key={c.id}>{c.content}</li>
          )
        })}
      </ul>
    </div>
  )
}

export default BlogDetail