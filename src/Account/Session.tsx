import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
export default function Session({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState(false); // TODO change to true once we set up auth
  const dispatch = useDispatch();
  const fetchProfile = async () => {
    try {
      const currentUser = await client.profile();
      dispatch(setCurrentUser(currentUser));
    } catch (err) {
      console.error(err);
    }
    setPending(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!pending) {
    return children;
  }
}
