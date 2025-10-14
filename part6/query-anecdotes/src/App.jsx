import { useReducer } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnecdotes } from './requests';
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import AnecdoteList from './components/AnecdotesList';
import { AnecdoteContextProvider } from './AnecdoteContext';

const App = () => {

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn:getAnecdotes,
    retry: 1,
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>service not available due to problems in server</div>
  }

  console.log(JSON.parse(JSON.stringify(result)))
  
  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
      <AnecdoteContextProvider>
        <Notification />
        <AnecdoteForm />
        <AnecdoteList anecdotes={anecdotes} />
      </AnecdoteContextProvider>
      
    </div>
  )
}

export default App
