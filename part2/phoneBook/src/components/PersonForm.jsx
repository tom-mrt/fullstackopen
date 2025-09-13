const PersonForm = ({ onSubmit, newName, newNumber, onChangeName, onChangeNum}) => {
    return (
        <form onSubmit={onSubmit}>
        <div>
          name: <input value={newName ?? "input your name"} onChange={onChangeName}/>
        </div>
        <div>
          number: <input value={newNumber ?? "input your number"} onChange={onChangeNum}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonForm