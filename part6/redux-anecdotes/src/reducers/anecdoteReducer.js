import { createSlice, current } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdotesSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      return state.map(a => {
        if (a.id === action.payload) {
          return { ...a, votes: a.votes + 1}
        }
        return a
      })
    },
    createAnecdote(state, action) {
      return state.concat(action.payload)
    },
    setAnecdote(state, action) {
      return action.payload
    }
  }

})

const { voteAnecdote, createAnecdote, setAnecdote } = anecdotesSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdote(anecdotes))
  }
};

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createAnecdote(content)
    dispatch(createAnecdote(newAnecdote))
  }
};

export const addVote = (anecdote) => {
  return async (dispatch) => {
    await anecdoteService.voteAnecdote(anecdote)
    dispatch(voteAnecdote(anecdote.id))
  }
};

export default anecdotesSlice.reducer