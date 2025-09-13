const ErrorNotification = ({ message }) => {
    const errorStyle = {
        color: "red",
        fontStyle: "italic",
        background: "lightgrey",
        fontSize: 20,
        borderStyle: "solid",
        borderRadius: 5,
        padding: 10,
        marginBottom: 5
    }

    if (message === null) {
        return null
    }

    return (
        <div style={errorStyle}>
            {message}
        </div>
    )
}

export default ErrorNotification