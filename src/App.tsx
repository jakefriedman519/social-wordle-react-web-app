import { BrowserRouter, Route, Routes } from "react-router-dom";

import store from "./store";
import { Provider } from "react-redux";
import Account from "./Account";
import Session from "./Account/Session";

export default function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Session>
          <Routes>
            <Route path="*" element={<Account />} />
            {/* TODO make home screen not */}
            {/* <Route path="/" element={<Navigate to="daily/wordle" />} /> */}
            {/* Users route */}
            {/* Tournaments */}
            {/* Past Worldes */}
            {/* Friends? */}
          </Routes>
        </Session>
      </Provider>
    </BrowserRouter>
  );
}