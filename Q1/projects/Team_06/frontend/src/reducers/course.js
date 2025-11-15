import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "",
    _id: null,
    instructor_name: "",
}

export const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setCourseDetails: (state, action) => {
      state.name = action.payload.name
      state._id = action.payload._id
      state.instructor_name = action.payload.instructor_name
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCourseDetails } = courseSlice.actions

export default courseSlice.reducer