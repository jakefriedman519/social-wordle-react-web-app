import axios from "axios";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const TOURNAMENTS_API = `${REMOTE_SERVER}/api/tournaments`;

const axiosWithCredentials = axios.create({ withCredentials: true });

export const createTournament = async (tournament: {
  name: string;
  maxPlayers: number;
  durationDays: number;
}) => {
  const response = await axiosWithCredentials.post(TOURNAMENTS_API, tournament);
  return response.data;
};

export const getAllTournaments = async () => {
  const response = await axiosWithCredentials.get(TOURNAMENTS_API);
  return response.data;
};

export const getTournamentById = async (tournamentId: string) => {
  const response = await axiosWithCredentials.get(
    `${TOURNAMENTS_API}/${tournamentId}`,
  );
  return response.data;
};

export const joinTournament = async (tournamentId: string) => {
  const response = await axiosWithCredentials.patch(
    `${TOURNAMENTS_API}/join/${tournamentId}`,
  );
  return response.data;
};

export const endTournament = async (tournamentId: string) => {
  const response = await axiosWithCredentials.patch(
    `${TOURNAMENTS_API}/end/${tournamentId}`,
  );
  return response.data;
};

export const deleteTournament = async (tournamentId: string) => {
  const response = await axiosWithCredentials.delete(
    `${TOURNAMENTS_API}/${tournamentId}`,
  );
  return response.data;
};

export const getTournamentLeaderboard = async (tournamentId: string) => {
  const response = await axiosWithCredentials.get(
    `${TOURNAMENTS_API}/${tournamentId}/leaderboard`,
  );
  return response.data;
};
