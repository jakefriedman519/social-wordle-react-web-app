import axios from "axios";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const EXTERNAL_API = `${REMOTE_SERVER}/api/external-api`;
export const COMMENTS_API = `${REMOTE_SERVER}/api/comments`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const getWordDetails = async (date: string) => {
  const response = await axios.get(`${EXTERNAL_API}/word/${date}`);
  return response.data;
};

export const getComments = async (date: string) => {
  const response = await axiosWithCredentials.get(
    `${COMMENTS_API}/day/${date}`,
  );
  return response.data;
};

export const createComment = async (
  userId: string,
  day: string,
  commentText: string,
) => {
  const response = await axiosWithCredentials.post(`${COMMENTS_API}`, {
    userId,
    wordleDay: day,
    text: commentText,
  });
  return response.data;
};

export const deleteComment = async (id: string) => {
  const response = await axiosWithCredentials.delete(`${COMMENTS_API}/${id}`);
  return response.data;
};
