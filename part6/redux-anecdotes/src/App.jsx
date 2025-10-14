import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import FilterText from './components/FilterText'
import Notification from './components/Notification';
import { initializeAnecdotes } from './reducers/anecdoteReducer';

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  const notification = useSelector(state => state.notification)
  return (
    <div>
      {notification && <Notification />}
      <FilterText />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App