import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import store from "./store";
import { Provider } from "react-redux";
import Account from "./Account";
import Session from "./Account/Session";
import Navigation from "./Navigation";
import Worldes from "./Worldes";
import ProtectedRoute from "./Account/ProtectedRoute";
import Leaderboard from "./Leaderboard";
import Tournaments from "./Tournaments";

export default function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Session>
          <Navigation />
          <Routes>
            <Route path="/" element={<Navigate to="wordle" />} />
            <Route path="/wordle" element={<Worldes />} />
            <Route path="/wordle/:day" element={<Worldes />} />
            <Route path="/wordle/custom/:wordleId" element={<Worldes />} />
            <Route
              path="/tournaments/:tournamentId"
              element={
                <ProtectedRoute>
                  <Tournaments />
                </ProtectedRoute>
              }
            />
            {/* Current day leaderboard isn't protected */}
            <Route path="/leaderboard/" element={<Leaderboard />} /> 
            <Route
              path="/leaderboard/:day"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Account />} />
          </Routes>
        </Session>
      </Provider>
    </BrowserRouter>
  );
}
