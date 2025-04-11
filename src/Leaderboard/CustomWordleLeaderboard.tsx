import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as client from "../Worldes/client";

import LeaderboardComponent from "./LeaderboardComponent";
import { WordleGuess } from ".";

export default function Leaderboard() {
  const { wordleId } = useParams<{ wordleId: string }>();
  const [title, setTitle] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<{
    leaderboard: WordleGuess[];
    isLoading: boolean;
  }>({
    leaderboard: [],
    isLoading: true,
  });

  const fetchLeaderboard = async () => {
    try {
      const response = await client.getWordleGuessesByWorldeId(
        wordleId as string
      );
      setLeaderboard({ leaderboard: response, isLoading: false });
    } catch {
      setLeaderboard({ leaderboard: [], isLoading: false });
    }
  };

  const fetchWordleTitle = async () => {
    const response = await client.getWordleByWordleId(wordleId as string);
    setTitle(response.title);
  };

  useEffect(() => {
    fetchLeaderboard();
    fetchWordleTitle();
  }, [wordleId]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 fw-bold">Custom Wordle Leaderboard</h1>
      {leaderboard.isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <LeaderboardComponent
            leaderboard={leaderboard.leaderboard}
            onDateChange={() => {}}
            allowDateChange={false}
            title={`"${title}"`}
          />
        </>
      )}
    </div>
  );
}
