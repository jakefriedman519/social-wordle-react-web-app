import { BsTrophy } from "react-icons/bs";
import { WordleGuess } from ".";

export default function LeaderboardScoreCard({
  rank,
  entry,
}: {
  rank: number;
  entry: WordleGuess;
}) {
  const bgClassMap: { [key: number]: string } = {
    1: "bg-warning bg-opacity-10 border-warning",
    2: "bg-light border-secondary",
    3: "bg-orange bg-opacity-10 border-danger",
  };

  const trophyColorMap: { [key: number]: string } = {
    1: "text-warning",
    2: "text-secondary",
    3: "text-danger",
  };

  const getBgClass = () => bgClassMap[rank] || "bg-white border-light";

  const getTrophyColor = () => trophyColorMap[rank] || "";

  return (
    <div
      className={`d-flex align-items-center p-3 rounded border mb-2 ${getBgClass()}`}
    >
      <div className="d-flex justify-content-center" style={{ width: "32px" }}>
        {rank <= 3 ? (
          <BsTrophy
            className={`${getTrophyColor()}`}
            style={{ fontSize: "18px" }}
          />
        ) : (
          <span className="small fw-medium text-muted">{rank}</span>
        )}
      </div>

      <div className="d-flex align-items-center ms-2 flex-grow-1">
        <div className="ms-3">
          <div className="fw-medium">{entry.userId.username}</div>
          <div className="small text-muted">
            {entry.guesses.length} attempts • {entry.timeSpent} seconds • {entry.completed ? "Completed" : "Not Completed"}
          </div>
        </div>
      </div>

      <div className="fw-semibold fs-5">{entry.score}</div>
    </div>
  );
}
