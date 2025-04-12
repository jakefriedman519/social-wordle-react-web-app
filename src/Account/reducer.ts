import { createSlice } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: Date;
  role: "ADMIN" | "USER";
  lastActivity?: Date;
  totalActivity?: string;
}

const initialState: {
  currentUser: User | null;
} = {
  currentUser: null,
};
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});
export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;