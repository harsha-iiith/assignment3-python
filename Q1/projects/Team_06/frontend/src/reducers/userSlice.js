import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: 'Student User',
  role: 'student', // 'student' | 'instructor' - Set to instructor by default
  id: 'stu104', // Match the authorId used in the demo data
  email: 'student@example.com',
  isAuthenticated: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateUserRole: (state, action) => {
      state.role = action.payload;
    },
    setAuthentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    clearUser: () => {
      return {
        name: '',
        role: 'student',
        id: '',
        email: '',
        isAuthenticated: false,
      };
    },
  },
});

export const { setUser, updateUserRole, setAuthentication, clearUser } = userSlice.actions;
export default userSlice.reducer;