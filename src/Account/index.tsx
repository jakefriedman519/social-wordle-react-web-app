import Signin from "./SignIn.tsx";
import Profile from "./Profile.tsx";
import Signup from "./SignUp.tsx";
import { Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store.ts";

export default function Account() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={currentUser ? "/profile" : "/login"} />}
        />
        <Route path="/login" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:uid" element={<Profile />} />
        <Route path="/register" element={<Signup />} />
      </Routes>
    </>
  );
}
