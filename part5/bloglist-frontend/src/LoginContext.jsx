import { createContext, useReducer } from 'react';

const initialInfo = { username: "", password: "" }

const loginReducer = (state=initialInfo, action) => {
  switch (action.type) {
    case "name":
      return { ...state, username: action.payload }
    case "password":
      return { ...state, password: action.payload }
    case "clear":
      return initialInfo
    default:
      return state
  }
}

const LoginContext = createContext()

export const LoginContextProvider = (props) => {
  const [loginInfo, loginDispatch] = useReducer(loginReducer, initialInfo)

  return (
    <LoginContext.Provider value={{ loginInfo, loginDispatch }}>
      {props.children}
    </LoginContext.Provider>
  )
};

export default LoginContext;