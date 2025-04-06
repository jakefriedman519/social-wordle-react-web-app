// TODO query by the wordleId, we should create this ourself i think

import { useEffect, useState } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import * as client from "../client";
import CreateWordleModal from "./CreateWordleModal";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface User {
  _id: string;
  username: string;
}

export interface CustomWordle {
  _id: string;
  userId: User;
  wordleWord: string;
  createdDate: Date;
  difficulty: Difficulty;
  title: string;
}

// this page should show all custom wordles created by any user, lets have this be searchable by title, created date, and user
// maybe use cards to show the wordles, and have a button to create a new wordle
// allow users to click into edit the wordle, and also to play the wordle
export default function CustomWordles() {
  const [wordles, setWordles] = useState<CustomWordle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [showCreateWordleModal, setShowCreateWordleModal] =
    useState<boolean>(false);

  const fetchCustomWordles = async () => {
    try {
      const response = await client.getAllCustomWordles();
      setWordles(response);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      setWordles([]);
    }
  };

  useEffect(() => {
    fetchCustomWordles();
    setIsLoading(false);
    // TODO fetch all custom wordles and show them in a list
    // TODO add a button to create a new wordle
    // TODO add a search bar to search by title, created date, and user
  }, []);
  return (
    <div className="container mt-5">
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center flex-row mb-4">
            <h1 className="fw-bold display">Custom Wordles</h1>
            <Button variant="primary" onClick={() => setShowCreateWordleModal(true)}>
              Create a Wordle
            </Button>
          </div>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search by title, created date, and user"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form.Group>
          {wordles.map((wordle: CustomWordle) => (
            <div key={wordle._id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{wordle.title}</Card.Title>
                  <Card.Text>
                    <strong>Created By:</strong> {wordle.userId?.username}{" "}
                    <br />
                    <strong>Created Date:</strong>{" "}
                    {new Date(wordle.createdDate).toLocaleDateString()} <br />
                    <strong>Difficulty:</strong> {wordle.difficulty}
                  </Card.Text>
                  <div className="d-flex justify-content-end">
                    <a
                      href={`/wordle/custom/${wordle._id}`}
                      className="btn btn-primary"
                    >
                      Play
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
          <CreateWordleModal
            show={showCreateWordleModal}
            handleClose={() => setShowCreateWordleModal(false)}
          />
        </>
      )}
    </div>
  );
}
