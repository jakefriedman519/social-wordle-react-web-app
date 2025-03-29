import axios from "axios";
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const signin = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/sign-in`,
    credentials
  );
  return response.data;
};

export const signup = async (user: { username: string; password: string }) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/sign-up`, user);
  return response.data;
};

export const profile = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
  return response.data;
};

export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/sign-out`);
  return response.data;
};
