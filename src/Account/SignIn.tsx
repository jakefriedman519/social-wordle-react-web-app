import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { Button, FormControl } from "react-bootstrap";

export default function Signin() {
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signin = async () => {
    const user = await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    navigate("/");
  };

  return (
    <div>
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
        id="wd-signin-btn"
        className="btn btn-primary w-100"
      >
        Sign in
      </Button>
      <Link id="wd-signup-link" to="/sign-up">
        Sign up
      </Link>
    </div>
  );
}
