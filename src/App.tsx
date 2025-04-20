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
import CustomWordles from "./Worldes/CustomWordles";
import CustomWordleGame from "./Worldes/CustomWordles/CustomWordleGame";
import CustomWordleLeaderboard from "./Leaderboard/CustomWordleLeaderboard";
import CreateTournament from "./Tournaments/CreateTournament.tsx";
import TournamentPage from "./Tournaments/TournamentPage.tsx";
import Details from "./Details/index.tsx";

// TODO add navigation throughout the pages ie back btns etc
export default function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Session>
          <Navigation />
          <div className="container-fluid min-vh-100 d-flex flex-column align-items-center bg-light">
            <Routes>
              {/* wordles */}
              <Route path="/" element={<Navigate to="wordle" />} />
              <Route path="/wordle" element={<Worldes />} />
              <Route path="/wordle/:day" element={<Worldes />} />
              {/* custom wordles */}
              <Route
                path="/wordle/custom"
                element={
                  <ProtectedRoute>
                    <CustomWordles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wordle/custom/:wordleId"
                element={
                  <ProtectedRoute>
                    <CustomWordleGame />
                  </ProtectedRoute>
                }
              />
              {/* tournaments */}
              <Route
                path="/tournaments"
                element={
                  <ProtectedRoute>
                    <Tournaments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tournaments/create"
                element={
                  <ProtectedRoute adminOnly>
                    <CreateTournament />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tournaments/:tournamentId"
                element={
                  <ProtectedRoute>
                    <TournamentPage />
                  </ProtectedRoute>
                }
              />
              {/* leaderboard */}
              <Route path="/leaderboard/" element={<Leaderboard />} />
              <Route
                path="/leaderboard/:day"
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard/custom/:wordleId"
                element={
                  <ProtectedRoute>
                    <CustomWordleLeaderboard />
                  </ProtectedRoute>
                }
              />
              {/* details */}
              <Route
                path="/details/:day"
                element={
                  <ProtectedRoute>
                    <Details />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Account />} />
            </Routes>
          </div>
        </Session>
      </Provider>
    </BrowserRouter>
  );
}
