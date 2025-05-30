import { useCallback, useEffect, useState } from "react";
import { Button, Card, Form, Spinner, Row, Col } from "react-bootstrap";
import * as client from "../client";
import CreateWordleModal from "./CreateWordleModal";
import _ from "lodash";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

interface UserId {
  _id: string;
  username: string;
}

export interface CustomWordle {
  _id: string;
  userId: UserId;
  wordleWord: string;
  createdDate: Date;
  difficulty: Difficulty;
  title: string;
}

export default function CustomWordles() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const [allWordles, setAllWordles] = useState<CustomWordle[]>([]);
  const [wordles, setWordles] = useState<CustomWordle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>(""); // for raw typing
  const [search, setSearch] = useState<string>(""); // actual debounced search
  const [createdDate, setCreatedDate] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [users, setUsers] = useState<UserId[]>([]);
  const [showCreateWordleModal, setShowCreateWordleModal] =
    useState<boolean>(false);

  const [editingWordle, setEditingWordle] = useState<CustomWordle | null>(null);

  const fetchCustomWordles = async ({
    title,
    createdDate,
    userId,
  }: {
    title?: string;
    createdDate?: string;
    userId?: string;
  }) => {
    setIsLoading(true);
    try {
      const query: Record<string, string> = {};
      if (title) query.title = title;
      if (createdDate) query.createdDate = createdDate;
      if (userId) query.userId = userId;
      const response = await client.getAllCustomWordles(query);
      setWordles(response);
    } catch {
      setWordles([]);
    }
    setIsLoading(false);
  };

  // Debounced version of fetch
  const debouncedFetch = useCallback(
    _.debounce((newSearch: string) => {
      setSearch(newSearch);
    }, 500),
    [],
  );

  // Watch searchInput and debounce
  useEffect(() => {
    debouncedFetch(searchInput);
  }, [searchInput, debouncedFetch]);

  // Trigger fetch when actual debounced `search` changes
  useEffect(() => {
    fetchCustomWordles({ title: search, createdDate, userId: selectedUserId });
  }, [search, createdDate, selectedUserId]);

  useEffect(() => {
    if (!showCreateWordleModal) {
      const fetchData = async () => {
        // Fetch all custom wordles and users on initial load
        const response = await client.getAllCustomWordles();
        setWordles(response);
        setAllWordles(response);
        setIsLoading(false);
      };
      fetchData();
    }
  }, [showCreateWordleModal]);

  useEffect(() => {
    // Set users based on allWordles
    const uniqueUsersMap = new Map<string, UserId>();
    allWordles.forEach((wordle) => {
      if (wordle.userId && !uniqueUsersMap.has(wordle.userId._id)) {
        uniqueUsersMap.set(wordle.userId._id, wordle.userId);
      }
    });
    setUsers(Array.from(uniqueUsersMap.values()));
  }, [allWordles]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Custom Wordles</h1>
        <Button
          variant="primary"
          onClick={() => {
            setEditingWordle(null);
            setShowCreateWordleModal(true);
          }}
        >
          Create a Wordle
        </Button>
      </div>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by title"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </Form.Group>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filter by Date</Form.Label>
            <Form.Control
              type="date"
              value={createdDate}
              onChange={(e) => setCreatedDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filter by User</Form.Label>
            <Form.Select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {wordles.map((wordle) => (
            <div key={wordle._id} className="mb-3">
              <Card>
                <Card.Header>
                  <strong>{wordle.title}</strong>
                </Card.Header>
                <Card.Body>
                  <Card.Text>
                    <strong>Created By:</strong> {wordle.userId?.username}{" "}
                    <br />
                    <strong>Created Date:</strong>{" "}
                    {new Date(wordle.createdDate).toLocaleDateString()} <br />
                    <strong>Difficulty:</strong> {wordle.difficulty}
                  </Card.Text>
                  <div className="d-flex justify-content-end">
                    {currentUser &&
                      (currentUser as { _id: string })?._id ===
                        wordle.userId._id && (
                        <Button
                          variant="warning"
                          className="me-2"
                          onClick={() => {
                            setEditingWordle(wordle);
                            setShowCreateWordleModal(true);
                          }}
                        >
                          Edit
                        </Button>
                      )}
                    <Link
                      to={`/leaderboard/custom/${wordle._id}`}
                      className="btn btn-secondary me-2"
                    >
                      Leaderboard
                    </Link>
                    <Link
                      to={`/wordle/custom/${wordle._id}`}
                      className="btn btn-primary"
                    >
                      Play
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
          <CreateWordleModal
            show={showCreateWordleModal}
            handleClose={() => setShowCreateWordleModal(false)}
            wordle={editingWordle}
          />
        </>
      )}
    </div>
  );
}
