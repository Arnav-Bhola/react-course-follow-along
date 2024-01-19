import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

const auth = createSlice({
  name: "authentication",
  initialState: initialState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

export const authActions = auth.actions;

export default auth.reducer;
