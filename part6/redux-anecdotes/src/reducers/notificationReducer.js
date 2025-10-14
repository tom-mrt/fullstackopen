import { createSlice } from '@reduxjs/toolkit';

const initialState = ""

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    createNotification(state, action) {
      return action.payload
    }
  }
})

const { createNotification } = notificationSlice.actions

export const setNotification = (message, seconds) => {
  return async (dispatch) => {
    dispatch(createNotification(message))
    setTimeout(() => {
      dispatch(createNotification(""))
    }, seconds*1000)
  };
};

export default notificationSlice.reducer