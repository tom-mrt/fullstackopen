import { useDispatch } from 'react-redux'
import { appendAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value
    console.log(content);
    event.target.anecdote.value = ""
    // 入力値をバックエンドに送る
    dispatch(appendAnecdote(content))
    dispatch(setNotification(`You create ${content}`, 5))
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={(e) => addAnecdote(e)}>
        <div><input name='anecdote'/></div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
};

export default AnecdoteForm