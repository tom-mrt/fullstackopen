import { useDispatch } from 'react-redux';
import { appendNote } from '../reducers/noteReducer';
import noteService from '../services/notes';

const NoteForm = () => {
  const dispatch = useDispatch()

  const addNote = async (event) => {
      event.preventDefault()
      const content = event.target.note.value
      event.target.note.value = ''
      const newNote = await noteService.createNew(content)
      dispatch(appendNote(content))
    }

  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add</button>
      </form>
    </div>
  )
};

export default NoteForm;