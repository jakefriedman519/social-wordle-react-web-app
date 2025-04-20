import axios from "axios";
import { User } from "./reducer";
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;
const WORDLE_GUESSES_API = `${REMOTE_SERVER}/api/wordle-guesses`;
const COMMENTS_API = `${REMOTE_SERVER}/api/comments`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const signin = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/sign-in`,
    credentials,
  );
  return response.data;
};

export const signup = async (user: { username: string; password: string }) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/sign-up`,
    user,
  );
  return response.data;
};

export const profile = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
  return response.data;
};

export const getUserProfile = async (uid: string) => {
  const response = await axiosWithCredentials.get(`${USERS_API}/${uid}`);
  return response.data;
};

export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/sign-out`);
  return response.data;
};

export const updateUserProfile = async (user: User) => {
  const response = await axiosWithCredentials.put(
    `${USERS_API}/${user._id}`,
    user,
  );
  return response.data;
};

export const getUserWordleGuesses = async (uid: string) => {
  const response = await axiosWithCredentials.get(
    `${WORDLE_GUESSES_API}/user/${uid}`,
  );
  return response.data;
};

export const getUserTournaments = async (uid: string) => {
  const response = await axiosWithCredentials.get(
    `${USERS_API}/${uid}/tournaments`,
  );
  return response.data;
};

export const getUserStats = async (uid: string) => {
  const response = await axiosWithCredentials.get(`${USERS_API}/${uid}/stats`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axiosWithCredentials.get(`${USERS_API}`);
  return response.data;
};

export const getUserComments = async (userId: string) => {
  const response = await axiosWithCredentials.get(
    `${COMMENTS_API}/user/${userId}`,
  );
  return response.data;
};
