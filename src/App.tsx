import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import store from "./store";
import { Provider } from "react-redux";
import Account from "./Account";
import Session from "./Account/Session";
import Navigation from "./Navigation";
import Worldes from "./Worldes";

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
              <Route path="*" element={<Account />} />
              {/* TODO make protected routes */}
              {/* Tournaments */}
              {/* Past Worldes */}
            </Routes>
          </div>
        </Session>
      </Provider>
    </BrowserRouter>
  );
}
