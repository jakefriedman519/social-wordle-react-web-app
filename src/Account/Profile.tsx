import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";
import { RootState } from "../store";
import { Button } from "react-bootstrap";

// TODO make this work and pull info, allow users to edit their profile & make public profiles so u can see their info from leaderboards etc
export default function Profile() {
  const [profile, setProfile] = useState<object>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const fetchProfile = () => {
    if (!currentUser) return navigate("/sign-in");
    setProfile(currentUser);
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/sign-in");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <h3>Profile</h3>
      {profile && (
        <div>
          <Button
            onClick={signout}
            className="btn btn-danger w-100"
          >
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}
