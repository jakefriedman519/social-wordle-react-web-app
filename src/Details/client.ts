import axios from "axios";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const EXTERNAL_API = `${REMOTE_SERVER}/api/external-api`;

export const getWordDetails = async (date: string) => {
  const response = await axios.get(`${EXTERNAL_API}/word/${date}`);
  return response.data;
};
