import Signin from "./SignIn.tsx";
import Profile from "./Profile.tsx";
import Signup from "./SignUp.tsx";
import { Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store.ts";
import ProtectedRoute from "./ProtectedRoute.tsx";

export default function Account() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  // TODO have a my wordles page, see past wordles and stats, see past tournaments, also have a place to create wordles and see created wordles ..
  // allow users to send the link (with uuid of created wordle) to other users to play the wordle, use same uuid to see leaderboard of the wordle
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
          <Route
            path="/profile/:uid"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/sign-up" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}
