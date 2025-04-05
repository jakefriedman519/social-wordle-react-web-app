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
          <div className="main-content-offset">
            <Routes>
              <Route path="/" element={<Navigate to="wordle" />} />
              <Route path="/wordle" element={<Worldes />} />
              <Route
                path="/tournaments"
                element={
                  <ProtectedRoute>
                    {/* TODO replace ~ either use protected route OR hide page which is my preference behind like component - you must sign in to view this page*/}
                    <Worldes />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Account />} />
              {/* Tournaments */}
              {/* Past Worldes */}
            </Routes>
          </div>
        </Session>
      </Provider>
    </BrowserRouter>
  );
}
