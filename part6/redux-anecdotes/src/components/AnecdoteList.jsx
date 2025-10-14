import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div key={anecdote.id}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleClick(anecdote)}>vote</button>
      </div>
    </div>
  )
};

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    if (state.filter) {
      return state.anecdotes
        .filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase()))
        .sort((a, b) => b.votes - a.votes)
    } else return [...state.anecdotes].sort((a, b) => b.votes - a.votes)

  })
  const notification = useSelector(state => state.notification)
  const dispatch = useDispatch()
  console.log(notification);
  

  const vote = (anecdote) => {
    dispatch(addVote(anecdote))
    dispatch(setNotification(`You voted ${anecdote.content}`, 5))
  }


  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
       <Anecdote key={anecdote.id} anecdote={anecdote} handleClick={vote}/>
      )}
    </div>
  )
};

export default AnecdoteList;