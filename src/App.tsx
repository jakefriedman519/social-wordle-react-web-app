import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import store from "./store";
import { Provider } from "react-redux";
import Account from "./Account";
import Session from "./Account/Session";
import Navigation from "./Navigation";
import Worldes from "./Worldes";
import ProtectedRoute from "./Account/ProtectedRoute";

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
            {/* TODO replace with real components */}
            <Route
              path="/tournaments"
              element={
                <ProtectedRoute>
                  <Worldes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Worldes />
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
