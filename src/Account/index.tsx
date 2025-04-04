import Signin from "./SignIn.tsx";
import Profile from "./Profile.tsx";
import Signup from "./SignUp.tsx";
import { Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store.ts";

export default function Account() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light py-5">
      <div>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={currentUser ? "/profile" : "/sign-in"} />}
          />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sign-up" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}
