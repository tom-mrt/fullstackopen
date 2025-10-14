import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnecdote } from '../requests';
import AnecdoteContext from '../AnecdoteContext';

const AnecdoteForm = () => {
  const { message, notifyDispatch } = useContext(AnecdoteContext)
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["anecdotes"] })
    // }
    onSuccess: (newAnecdote) => {
      notifyDispatch({ type: "SHOW", payload: `You created "${newAnecdote.content}"` })
      setTimeout(() => notifyDispatch({ type: "CLEAR"}), 5000)
      const anecdotes = queryClient.getQueryData(["anecdotes"])
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote))
    },
    onError: (e) => {
      console.log(e);
      notifyDispatch({ type: "SHOW", payload: "too short anecdote, must have length 5 or more"})
      setTimeout(() => notifyDispatch({ type: "CLEAR" }), 5000)
    }
  })
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0})
    
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
