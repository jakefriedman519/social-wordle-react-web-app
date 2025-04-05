import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { Button, FormControl, Toast, ToastContainer } from "react-bootstrap";

// TODO maybe add a toast that pops up if redirected from protected route that says "You need to sign in to access this page" or something like that
export default function Signin() {
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signin = async () => {
    let user;
    try {
      user = await client.signin(credentials);
    } catch {
      setShow(true);
      setToastMessage("Invalid username or password");
      return;
    }
    if (!user) return;
    dispatch(setCurrentUser(user));
    navigate("/");
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h3>Sign in</h3>
      <FormControl
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        className="mb-2"
        placeholder="username"
      />
      <FormControl
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        className="mb-2"
        placeholder="password"
        type="password"
      />
      <Button
        onClick={signin}
        id="signin-btn"
        className="btn btn-primary w-100 mb-2"
      >
        Sign in
      </Button>
      <Link id="signup-link" to="/sign-up">
        Sign up
      </Link>
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1 }}>
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
          <Toast.Header>{toastMessage}</Toast.Header>
        </Toast>
      </ToastContainer>
    </div>
  );
}
