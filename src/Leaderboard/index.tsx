import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as client from "../Worldes/client";

import DailyLeaderboardComponent from "./DailyLeaderboardComponent";

export interface WordleGuess {
  _id: string;
  userId: {
    _id: string;
    username: string;
  };
  score: number;
  guesses: string[];
  timeSpent: number;
  completed: boolean;
}

// TODO: finish this implementation, this is the leaderboard for daily wordles, we can also alter this to take a uuid for custom wordles
export default function Leaderboard() {
  const navigate = useNavigate();
  const { day } = useParams<{ day: string }>();
  const [leaderboard, setLeaderboard] = useState<{
    leaderboard: WordleGuess[];
    isLoading: boolean;
  }>({
    leaderboard: [],
    isLoading: true,
  });

  const fetchLeaderboard = async () => {
    try {
      const response = await client.getWordleGuessesByDay(
        day || new Date().toISOString().split("T")[0]
      );
      console.log("Leaderboard response: ", response); // TODO populate username
      setLeaderboard({ leaderboard: response, isLoading: false });
    } catch {
      setLeaderboard({ leaderboard: [], isLoading: false });
    }
  };

  const handleDateChange = (date: string) => {
    navigate(`/leaderboard/${date}`);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [day]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 fw-bold">Leaderboard</h1>
      {leaderboard.isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <DailyLeaderboardComponent
            leaderboard={leaderboard.leaderboard}
            onDateChange={handleDateChange}
            allowDateChange={true}
          />
        </>
      )}
    </div>
  );
}
