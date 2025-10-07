const Notification = ({ message, errorFlag }) => {
  if (message === '') {
    return null
  }

  const notificationStyle = errorFlag
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
    <p style={notificationStyle}>{message}</p>
  )
}

export default Notification