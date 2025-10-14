import { useSelector, useDispatch } from 'react-redux';
import { toggleImportanceOf } from '../reducers/noteReducer';

const Note = ({ note, handleClick }) => {
  return (
    <div>
      <li
        key={note.id} 
        onClick={() => handleClick(note.id)}
      >
        {note.content} <strong>{note.important ? 'important' : ''}</strong>
      </li>
    </div>
  )
};

const NoteList = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => {
    if (state.filter === "ALL") {
      return state.notes
    }
    return state.filter === "IMPORTANT"
      ? state.notes.filter(note => note.important)
      : state.notes.filter(note => !note.important)
  })


  return (
    <div>
      <ul>
          {notes.map(note =>
            <Note key={note.id} note={note} handleClick={() => dispatch(toggleImportanceOf(note.id))}/>
          )}
        </ul>
    </div>
  )
};

export default NoteList;