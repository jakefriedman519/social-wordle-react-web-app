import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as client from "../Worldes/client";
import DatePickerModal from "../shared/components/DatePickerModal";

type LeaderboardEntry = {
  username: string;
  score: number;
};

// TODO: finish this implementation, this is the leaderboard for daily wordles, we can also alter this to take a uuid for custom wordles
export default function Leaderboard() {
  const { day } = useParams<{ day: string }>();
  const [leaderboard, setLeaderboard] = useState<{
    leaderboard: LeaderboardEntry[];
    isLoading: boolean;
  }>({
    leaderboard: [],
    isLoading: true,
  });

  const fetchLeaderboard = async () => {
    try {
      // TODO sort by score on the backend
      const response = await client.getWordleGuessesByDay(
        day || new Date().toISOString().split("T")[0]
      );
      console.log("Leaderboard response: ", response); // TODO populate username
      setLeaderboard({ leaderboard: response, isLoading: false });
      setLeaderboard({ leaderboard: [], isLoading: false });
    } catch {
      setLeaderboard({ leaderboard: [], isLoading: false });
    }
  };

  const datePickerHandler = (date: string) => {
    console.log("Date picked: ", date);
    // window.location.href = `/leaderboard/${date}`;
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [day]);

  return (
    <div>
      <h1>Leaderboard</h1>
      {leaderboard.isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <DatePickerModal datePickerHandler={datePickerHandler} />
          <ul>
            {/* TODO clicking on name should navigate to that users public profile profile/:username */}
            {leaderboard.leaderboard.map((entry: LeaderboardEntry) => (
              <li key={entry.username}>
                {entry.username}: {entry.score}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
