import { createContext, useReducer } from 'react';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SHOW":
      return action.payload
    case "CLEAR":
      return ""
    default: 
      return state
  }
}

const AnecdoteContext = createContext()

export const AnecdoteContextProvider = (props) => {
  const [message, notifyDispatch] = useReducer(notificationReducer, "")

  return (
    <AnecdoteContext.Provider value={{ message, notifyDispatch}}>
      {props.children}
    </AnecdoteContext.Provider>
  )
};

export default AnecdoteContext;