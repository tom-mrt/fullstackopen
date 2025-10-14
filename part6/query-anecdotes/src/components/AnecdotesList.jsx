import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voteAnecdote } from '../requests';
import AnecdoteContext from '../AnecdoteContext';

const Anecdote = ({ anecdote, handleVote }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleVote(anecdote)}>vote</button>
      </div>
    </div>
  )
};

const AnecdotesList = ({ anecdotes }) => {
  const queryClient = useQueryClient()
  const { notifyDispatch } = useContext(AnecdoteContext)

  const voteMutation = useMutation({
  mutationFn: voteAnecdote,
  onSuccess: (votedAnecdote) => {
    const anecdotes = queryClient.getQueryData(["anecdotes"])
    queryClient.setQueryData(["anecdotes"], anecdotes.map(a => a.id === votedAnecdote.id ? votedAnecdote : a))
  }
  })

  const handleVote = (anecdote) => {
    console.log({ ...anecdote, votes: anecdote.votes + 1});
    
    voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1})
    notifyDispatch({ type: "SHOW", payload: `anecdote "${anecdote.content}" voted`})
    setTimeout(() => {notifyDispatch({ type: "CLEAR"})}, 5000)
  }
  return (
    <div>
      {anecdotes.map((anecdote) => (
        <Anecdote key={anecdote.id} anecdote={anecdote} handleVote={handleVote} />
      ))}
    </div>
  )
};

export default AnecdotesList;