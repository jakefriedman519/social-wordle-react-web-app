import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  ListGroup,
  Alert,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import {
  joinTournament,
  getTournamentById,
  getTournamentLeaderboard,
} from "./client";
import { useSelector } from "react-redux";
import { formatDateUTC } from "../dateUtils.ts"; // Import necessary functions

export default function TournamentPage() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const fetchLeaderboard = async () => {
    try {
      const leaderboardData = await getTournamentLeaderboard(
        tournamentId as string,
      );
      setLeaderboard(leaderboardData);
    } catch {
      setError("Failed to load leaderboard.");
    }
  };

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const data = await getTournamentById(tournamentId as string);
        setTournament(data);
      } catch {
        setError("Failed to load tournament details.");
      }
    };

    fetchTournamentDetails();
    fetchLeaderboard();
  }, [tournamentId]);

  const handleJoinTournament = async () => {
    try {
      const data = await joinTournament(tournamentId as string);
      setSuccess(`Joined tournament "${data.name}" successfully!`);
      setTournament(data); // Update the tournament data with the new player list
      fetchLeaderboard();
    } catch {
      setError("Failed to join tournament.");
    }
  };

  return (
    <Container className="pt-4">
      <h1>Tournament: {tournament?.name}</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Tournament Details */}
      {tournament && (
        <div>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="fw-bold">Tournament Dates</h5>
              <p className="mb-0">
                {formatDateUTC(new Date(tournament.startDate))} -{" "}
                {formatDateUTC(new Date(tournament.endDate))}
              </p>
            </Card.Body>
          </Card>
          <Row>
            <Col>
              <h3>
                Players ({tournament.players.length}/{tournament.maxPlayers})
              </h3>
              <ListGroup>
                {tournament.players.map((player: any, index: number) => (
                  <ListGroup.Item key={index}>{player.username}</ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col>
              <h3>Leaderboard</h3>
              <ListGroup>
                {leaderboard.length === 0 ? (
                  <ListGroup.Item>
                    No leaderboard data available.
                  </ListGroup.Item>
                ) : (
                  leaderboard.map((entry, index) => (
                    <ListGroup.Item key={index}>
                      {entry.username} - {entry.totalScore} points
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Col>
          </Row>

          <div className="mt-2 d-flex flex-row gap-2">
            {/* Join Tournament Button */}
            {tournament.players.length < tournament.maxPlayers &&
              !tournament.players
                .map((player: any) => player._id)
                .includes(currentUser._id) && (
                <Button variant="primary" onClick={handleJoinTournament}>
                  Join Tournament
                </Button>
              )}

            {/* Navigation */}
            <Button
              variant="outline-primary"
              onClick={() => navigate("/tournaments")}
            >
              Back to Tournaments
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
