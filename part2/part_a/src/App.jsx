import { useState, useEffect } from "react"
import Footer from "./components/Footer"
import Note from "./components/Note"
import Notification from "./components/Notification"
import noteService from "./services/notes"

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])
  

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote("")
      })
  }

const handleNoteChange = (event) => {
  console.log(event.target.value)
  setNewNote(event.target.value)
}

const notesToShow = showAll ? notes : notes.filter(note => note.important)

const toggleImportanceOf = (id) => {
  console.log("importance of " + id + " needs to be toggled");
  const url = `http://localhost:3001/notes/${id}`
  const note = notes.find(n => n.id === id)
  // Stateを直接変更するのはNG。note.important = !note.importantは❌
  // オブジェクトのコピーを作成し、内容を変更する
  const changedNote = { ...note, important: !note.important}

  noteService
    .update(id, changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id === id ? returnedNote : note))
    })
    .catch(error => {
      setErrorMessage(
        `Note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  
}

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>show {showAll ? "important" : "all"}</button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id}
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
            />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App