import { useContext } from 'react';
import NotifyContext from '../NotifyContext';

const Notification = () => {
  const { notification } = useContext(NotifyContext)

  if (notification.message === '') {
    return null
  }

  const notificationStyle = notification.isError
    ? {
      color: 'red',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }
    : {
      color: 'green',
      background: 'white',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }

  return (
    <p style={notificationStyle}>{notification.message}</p>
  )
}

export default Notification