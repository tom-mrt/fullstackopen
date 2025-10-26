import { createContext, useReducer } from 'react';

const initialNotification = { message: "", isError: false }

const notificationReducer = (state=initialNotification, action) => {
  switch (action.type) {
    case "notify":
      return { message: action.payload, isError: false }
    case "error":
      return { message: action.payload, isError: true }
    case "clear":
      return initialNotification
    default:
      return state
  }
}

const NotifyContext = createContext()

export const NotifyContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, initialNotification)

  return (
    <NotifyContext.Provider value={{ notification, notificationDispatch }}>
      {props.children}
    </NotifyContext.Provider>
  )
};

export default NotifyContext;