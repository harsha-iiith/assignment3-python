import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;