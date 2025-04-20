import { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { createTournament } from "./client"; // import createTournament from your client
import { useNavigate } from "react-router-dom";

export default function CreateTournament() {
  const [name, setName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(8); // Default number of players
  const [durationDays, setDurationDays] = useState(1); // Default duration in days
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !maxPlayers || !durationDays) {
      setError("Please fill out all fields.");
      return;
    }

    const tournamentData = {
      name,
      maxPlayers,
      durationDays,
    };

    try {
      const response = await createTournament(tournamentData);
      navigate(`/tournaments/${response._id}`);
    } catch {
      setError("Failed to create tournament. Please try again.");
    }
  };

  return (
    <Container>
      <h1>Create Tournament</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="tournamentName">
              <Form.Label>Tournament Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter tournament name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="maxPlayers">
              <Form.Label>Max Players</Form.Label>
              <Form.Control
                type="number"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                min="2"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="durationDays">
              <Form.Label>Duration (Days)</Form.Label>
              <Form.Control
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value))}
                min="1"
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="mt-2">
          Create Tournament
        </Button>
      </Form>
    </Container>
  );
}
