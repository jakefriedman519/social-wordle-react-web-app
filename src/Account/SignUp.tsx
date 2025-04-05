import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { Button, FormControl } from "react-bootstrap";

export default function SignUp() {
  const [user, setUser] = useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signup = async () => {
    const currentUser = await client.signup(user);
    dispatch(setCurrentUser(currentUser));
    navigate("/profile");
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h3>Sign up</h3>
      <FormControl
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        className="mb-2"
        placeholder="username"
      />
      <FormControl
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        className="mb-2"
        placeholder="password"
        type="password"
      />
      <Button
        onClick={signup}
        className="btn btn-primary mb-2 w-100"
      >
        Sign up
      </Button>
      <Link to="/sign-in">
        Sign in
      </Link>
    </div>
  );
}
