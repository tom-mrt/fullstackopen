import { useContext } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import NotifyContext from '../NotifyContext';
import LoginContext from '../LoginContext';

const LoginForm = ({ handleLogin }) => {
  const { notificationDispatch } = useContext(NotifyContext)
  const { loginInfo, loginDispatch } = useContext(LoginContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await handleLogin(loginInfo.username, loginInfo.password)
      loginDispatch({ type: "clear" })
      navigate("/blogs")
    } catch (e) {
      console.error('Async error:', e);
      notificationDispatch({ type: "error", payload: "wrong username or password"})
      setTimeout(() => {
        notificationDispatch({ type: "clear" })
      }, 5000)
    }
    
  };

    return (
      <div>

        <h2>log in to application</h2>
        <Notification />

        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>
              username
            </Form.Label>
              <Form.Control
                type="text"
                value={loginInfo.username}
                onChange={({ target }) => loginDispatch({ type: "name", payload: target.value })}
              />
          </Form.Group>
          
          <Form.Group>
            <Form.Label>
              password
            </Form.Label>
              <Form.Control
                type="password"
                value={loginInfo.password}
                onChange={({ target }) => loginDispatch({ type: "password", payload: target.value})}
              />
          </Form.Group>
          
          <Button variant="primary" type="submit">login</Button>
        </Form>
      </div>
    )
  }

  export default LoginForm;