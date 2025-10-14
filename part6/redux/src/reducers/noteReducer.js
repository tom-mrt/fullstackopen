import { createSlice, current } from '@reduxjs/toolkit';
import noteService from '../services/notes';

const noteSlice = createSlice({
  name: "notes",
  initialState: [],
  reducers: {
    // 呼び出し時のタイプはnotes/createNoteとなる。
    createNote(state, action) {
      state.push(action.payload)
    },
    toggleImportanceOf(state, action) {
      const id =  action.payload
      const noteToChange = state.find(n => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
      console.log(current(state));
      
      return state.map(note => 
        note.id !== id ? note : changedNote
      )
    },
    setNotes(state, action) {
      return action.payload
    },
  },
})

const { createNote, setNotes } = noteSlice.actions

export const initializeNotes = () => {
  return async (dispatch) => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

export const appendNote = (content) => {
  return async (dispatch) => {
    const newNote = await noteService.createNew(content)
    dispatch(noteSlice.actions.createNote(newNote))
  }
};

export const { toggleImportanceOf } = noteSlice.actions
export default noteSlice.reducer