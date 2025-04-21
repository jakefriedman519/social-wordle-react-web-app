import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Button,
} from "react-bootstrap";
import * as client from "./client";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { formatDateUTC } from "../dateUtils.ts";

interface Tournament {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  players: string[];
  maxPlayers: number;
  creator: {
    _id: string;
    username: string;
  };
}

export default function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await client.getAllTournaments();
        setTournaments(response);
      } catch {
        setErrors("Error fetching tournaments.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tournaments</h2>
        {currentUser?.role === "ADMIN" && (
          <Button onClick={() => navigate("/tournaments/create")}>
            Create Tournament
          </Button>
        )}
      </div>

      {errors && (
        <Alert variant="danger" dismissible onClose={() => setErrors(null)}>
          {errors}
        </Alert>
      )}

      {loading ? (
        <div>Loading tournaments...</div>
      ) : (
        <Row>
          {tournaments.length > 0 ? (
            tournaments.map((tournament) => (
              <Col key={tournament._id} lg={6} className="mb-4">
                <Card className="h-100">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <h4 className="fw-bold">{tournament.name}</h4>
                      <p className="text-muted mb-2">
                        {formatDateUTC(new Date(tournament.startDate))} -{" "}
                        {formatDateUTC(new Date(tournament.endDate))}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg="primary">
                        {tournament.players.length}/{tournament.maxPlayers}{" "}
                        Participants
                      </Badge>
                      <div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            navigate(`/tournaments/${tournament._id}`)
                          }
                        >
                          View Details
                        </Button>
                        {currentUser?._id === tournament.creator._id && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="ms-2"
                            onClick={async () => {
                              await client.deleteTournament(tournament._id);
                              setTournaments((prev) =>
                                prev.filter((t) => t._id !== tournament._id),
                              );
                            }}
                          >
                            Delete Tournament
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Alert variant="info">No tournaments available yet.</Alert>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
}
