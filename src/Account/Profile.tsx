import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";
import { RootState } from "../store";
import { User } from "./reducer";

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Nav,
  Form,
  Badge,
  ListGroup,
  Alert,
} from "react-bootstrap";
import { formatDateUTC } from "../dateUtils.ts";

interface Wordle {
  _id: string;
  wordleId: string;
  guesses: string[];
  completed: boolean;
  createdDate?: Date;
  finishedDate?: Date;
}

interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  text: string;
  wordleDay: string;
}

// Tournament type
interface Tournament {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  players: string[];
  maxPlayers: number;
  rank?: number;
  score?: number;
}

// Stats type
interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  averageGuesses: number;
  distribution: number[];
}

export default function ProfilePage() {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  const [user, setUser] = useState<User>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>();
  const [pastWordles, setPastWordles] = useState<Wordle[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [stats, setStats] = useState<Stats>();
  const [showShareAlert, setShowShareAlert] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState({
    user: true,
    pastWordles: true,
    tournaments: true,
    stats: true,
    admin: true,
    comments: true,
  });
  const [errors, setErrors] = useState<{ [type: string]: string }>({});
  const [activeTab, setActiveTab] = useState<keyof typeof loading>("stats");
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const handleSignOut = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/login");
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      handleSaveProfile();
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading((prev) => ({ ...prev, user: true }));
      if (!editedUser) {
        throw new Error("Edited user is undefined");
      }
      const response = await client.updateUserProfile(editedUser);
      if (response) {
        if (currentUser?.role === "USER") {
          setUser((prev) => ({
            ...prev!,
            ...editedUser,
          }));
          setEditedUser(response);
          dispatch(setCurrentUser(response));
        } else {
          setEditedUser(user);
        }
        setIsEditing(false);
        setLoading((prev) => ({ ...prev, user: false }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        user: "Error updating profile",
      }));
      setIsEditing(false);
      setLoading((prev) => ({ ...prev, user: false }));
    }
  };

  const isUserProfileCurrentUser = () =>
    !uid || (currentUser && uid === currentUser._id);

  useEffect(() => {
    if (!uid && !currentUser) {
      navigate("/login");
    }
    if (uid) {
      // Fetch user data based on uid
      const fetchUser = async () => {
        try {
          const response = await client.getUserProfile(uid);
          setUser(response);
          setEditedUser(response);
          setLoading((prev) => ({ ...prev, user: false }));
        } catch {
          setErrors((prev) => ({
            ...prev,
            user: "Error fetching user profile",
          }));
        }
      };
      fetchUser();
    } else if (currentUser) {
      // Only set user if uid is not provided
      setUser(currentUser);
      setEditedUser(currentUser);
      setLoading((prev) => ({ ...prev, user: false }));
    }

    if (currentUser?.role === "ADMIN") {
      const fetchAllUsers = async () => {
        try {
          const response = await client.getAllUsers();
          setAllUsers(response);
          setLoading((prev) => ({ ...prev, admin: false }));
        } catch {
          setErrors((prev) => ({
            ...prev,
            admin: "Error fetching all users",
          }));
        }
      };

      fetchAllUsers();
    }

    const fetchUserWordles = async () => {
      try {
        const response = await client.getUserWordleGuesses(
          uid || currentUser?._id || "",
        );
        setPastWordles(response);
        setLoading((prev) => ({ ...prev, pastWordles: false }));
      } catch {
        setErrors((prev) => ({
          ...prev,
          pastWordles: "Error fetching past wordles",
        }));
      }
    };

    const fetchTournaments = async () => {
      try {
        const response = await client.getUserTournaments(
          uid || currentUser?._id || "",
        );
        setTournaments(response);
        setLoading((prev) => ({ ...prev, tournaments: false }));
      } catch {
        setErrors((prev) => ({
          ...prev,
          tournaments: "Error fetching tournaments",
        }));
      }
    };

    const fetchUserComments = async () => {
      try {
        const response = await client.getUserComments(
          uid || currentUser?._id || "",
        );
        setComments(response);
        setLoading((prev) => ({ ...prev, comments: false }));
      } catch {
        setErrors((prev) => ({ ...prev, comments: "Error fetching comments" }));
      }
    };

    const fetchStats = async () => {
      try {
        const response = await client.getUserStats(
          uid || currentUser?._id || "",
        );
        setStats(response);
        setLoading((prev) => ({ ...prev, stats: false }));
      } catch {
        setErrors((prev) => ({
          ...prev,
          stats: "Error fetching stats",
        }));
      }
    };

    fetchUserWordles();
    fetchTournaments();
    fetchUserComments();
    fetchStats();
  }, [currentUser, uid]);

  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      const fetchAllUsers = async () => {
        try {
          const response = await client.getAllUsers();
          setAllUsers(response);
          setLoading((prev) => ({ ...prev, admin: false }));
        } catch {
          setErrors((prev) => ({
            ...prev,
            admin: "Error fetching all users",
          }));
        }
      };

      fetchAllUsers();
    }
  }, [editedUser]);

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "stats":
        return (
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Overall Stats</h5>
                </Card.Header>
                <Card.Body className="d-flex flex-column justify-content-center h-100 gap-3">
                  <Row className="mb-3">
                    <Col className="text-center">
                      <h2>{stats?.gamesPlayed || 0}</h2>
                      <p className="text-muted mb-0">Played</p>
                    </Col>
                    <Col className="text-center">
                      <h2>{stats?.gamesWon || 0}</h2>
                      <p className="text-muted mb-0">Won</p>
                    </Col>
                    <Col className="text-center">
                      <h2>
                        {stats
                          ? Math.round(
                              (stats.gamesWon / stats.gamesPlayed) * 100,
                            )
                          : 0}
                        %
                      </h2>
                      <p className="text-muted mb-0">Win Rate</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-center">
                      <h2>{stats?.currentStreak || 0}</h2>
                      <p className="text-muted mb-0">Current Streak</p>
                    </Col>
                    <Col className="text-center">
                      <h2>{stats?.maxStreak || 0}</h2>
                      <p className="text-muted mb-0">Max Streak</p>
                    </Col>
                    <Col className="text-center">
                      <h2>{stats?.averageGuesses?.toFixed(1) || 0}</h2>
                      <p className="text-muted mb-0">Avg. Guesses</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={8} md={6} className="mb-4">
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Guess Distribution</h5>
                </Card.Header>
                <Card.Body>
                  {stats?.distribution?.map((count, index) => {
                    const maxCount = Math.max(...stats.distribution);
                    const percentage =
                      maxCount > 0 ? (count / maxCount) * 100 : 0;

                    return (
                      <div key={index} className="mb-2">
                        <div className="d-flex align-items-center">
                          <div style={{ width: "20px" }}>{index + 1}</div>
                          <div className="flex-grow-1">
                            <div
                              className="bg-success text-white px-2 py-1"
                              style={{
                                width: `${Math.max(percentage, 5)}%`,
                                minWidth: count > 0 ? "30px" : "0px",
                              }}
                            >
                              {count}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      case "pastWordles":
        return (
          <Card>
            <Card.Header>
              <h5 className="mb-0">Wordles Played</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {pastWordles.length > 0 ? (
                pastWordles.map((wordle) => (
                  <ListGroup.Item
                    key={wordle._id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h6 className="mb-0">
                        {wordle.completed
                          ? wordle.guesses[wordle.guesses.length - 1]
                          : wordle?.wordleId
                            ? "Unsolved Custom Wordle"
                            : "Unsolved Daily NYT Wordle"}
                      </h6>
                      <small className="text-muted">
                        {wordle?.createdDate
                          ? new Date(wordle.createdDate)
                              .toISOString()
                              .split("T")[0]
                          : "Custom Wordle"}{" "}
                        • {wordle.completed ? "Completed" : "Not Completed"}
                      </small>
                    </div>
                    <div>
                      <Button
                        onClick={() =>
                          navigate(
                            wordle?.createdDate
                              ? `/wordle/${
                                  new Date(wordle.createdDate)
                                    .toISOString()
                                    .split("T")[0]
                                }`
                              : `/wordle/custom/${wordle.wordleId}`,
                          )
                        }
                        variant="outline-primary"
                        size="sm"
                      >
                        View Wordle
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No wordles played yet.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        );
      case "tournaments":
        return (
          <Card>
            <Card.Header>
              <h5 className="mb-0">Tournament History</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {tournaments.length > 0 ? (
                tournaments.map((tournament) => (
                  <ListGroup.Item
                    key={tournament._id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h6 className="mb-0">{tournament.name}</h6>
                      <small className="text-muted">
                        <span className="me-1">📅</span>
                        {formatDateUTC(new Date(tournament.startDate))} -{" "}
                        {formatDateUTC(new Date(tournament.endDate))}
                      </small>
                    </div>
                    <div className="text-end">
                      <Badge bg="primary" className="me-2">
                        {tournament.players.length}/{tournament.maxPlayers}{" "}
                        Participants
                      </Badge>
                      {tournament.rank && (
                        <Badge
                          bg={tournament.rank <= 3 ? "warning" : "secondary"}
                        >
                          <span className="me-1">🏆</span>
                          Rank: {tournament.rank}
                        </Badge>
                      )}
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          navigate(`/tournaments/${tournament._id}`)
                        }
                      >
                        View Tournament
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>
                  No tournaments participated in yet.
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        );
      case "admin":
        // TODO implement admin view, show a list of all users, allow clicking edit user to populate edit card with that use
        return (
          <Card>
            <Card.Header>
              <h5 className="mb-0">All Users</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {allUsers.map((user) => (
                <ListGroup.Item>
                  <div
                    key={user._id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h6 className="mb-0">
                        {user.firstName} {user.lastName}
                      </h6>
                      <small className="text-muted">@{user.username}</small>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setEditedUser(user);
                        setIsEditing(true);
                      }}
                    >
                      Edit User
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        );
      case "comments":
        return (
          <Card>
            <Card.Header>
              <h5 className="mb-0">Comments</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <ListGroup.Item
                    key={comment._id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h6 className="mb-0">{comment.text}</h6>
                      <small className="text-muted">{comment.wordleDay}</small>
                    </div>
                    <div>
                      <Button
                        onClick={() =>
                          navigate(
                            `/details/${comment.wordleDay}?showDetails=true`,
                          )
                        }
                        variant="outline-primary"
                        size="sm"
                      >
                        View Details Page
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No comments yet.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="mb-4 fw-bold">Profile</h1>
      {Object.values(errors).map((error, index) => (
        <Alert key={index} variant="danger" dismissible>
          {error}
        </Alert>
      ))}
      {showShareAlert && isUserProfileCurrentUser() && (
        <Alert
          variant="success"
          onClose={() => setShowShareAlert(false)}
          dismissible
        >
          <Alert.Heading>Profile Link Ready to Share!</Alert.Heading>
          <p>
            Your profile link has been copied to clipboard:{" "}
            <strong>
              {window.location.origin.toString()}/profile/{user?._id}
            </strong>
          </p>
          <p>Share this link with friends to show them your wordle stats!</p>
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 className="mb-0">
                    {editedUser?.firstName} {editedUser?.lastName}
                  </h1>
                  <p className="text-muted">@{editedUser?.username}</p>
                </div>
                {(currentUser?.role === "ADMIN" ||
                  isUserProfileCurrentUser()) && (
                  <div>
                    {!isEditing && (
                      <Button
                        variant="outline-secondary"
                        className="me-2"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${window.location.origin.toString()}/profile/${
                              user?._id
                            }`,
                          );
                          setShowShareAlert(true);
                        }}
                      >
                        Share Profile
                      </Button>
                    )}
                    {!isEditing && (
                      <Button
                        variant="danger"
                        className="me-2"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    )}
                    <Button
                      variant={isEditing ? "success" : "outline-primary"}
                      onClick={handleEditToggle}
                    >
                      {isEditing ? "Save" : "Edit Profile"}
                    </Button>
                  </div>
                )}
              </div>

              {currentUser &&
                isUserProfileCurrentUser() &&
                (isEditing ? (
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={editedUser?.firstName || ""}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={editedUser?.lastName || ""}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={editedUser?.email || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={
                          editedUser?.dob
                            ? new Date(editedUser?.dob)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    {currentUser?.role === "ADMIN" && (
                      <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                          name="role"
                          value={editedUser?.role || ""}
                          onChange={(e) =>
                            setEditedUser((prev) => ({
                              ...prev!,
                              role: e.target.value as "ADMIN" | "USER",
                            }))
                          }
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </Form.Select>
                      </Form.Group>
                    )}
                  </Form>
                ) : (
                  <Row>
                    <Col md={6}>
                      {(currentUser.role === "ADMIN" ||
                        isUserProfileCurrentUser()) && (
                        <p>
                          <strong>Email:</strong> {user?.email}
                        </p>
                      )}
                      <p>
                        <strong>Date of Birth:</strong>{" "}
                        {user?.dob
                          ? `${new Date(user.dob).getUTCMonth() + 1}/${new Date(
                              user.dob,
                            ).getUTCDate()}/${new Date(
                              user.dob,
                            ).getUTCFullYear()}`
                          : "Not set"}
                      </p>
                      <p>
                        <strong>Role:</strong> {user?.role}
                      </p>
                    </Col>
                  </Row>
                ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Nav to select tab */}
      <Nav
        variant="tabs"
        className="mb-4"
        activeKey={activeTab}
        onSelect={(k) => k && setActiveTab(k as keyof typeof loading)}
      >
        <Nav.Item>
          <Nav.Link eventKey="stats">Stats</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="pastWordles">Past Wordles</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="tournaments">Tournaments</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="comments">Comments</Nav.Link>
        </Nav.Item>
        {currentUser?.role === "ADMIN" && (
          <Nav.Item>
            <Nav.Link eventKey="admin">Admin</Nav.Link>
          </Nav.Item>
        )}
      </Nav>

      {/* Render content based on active tab */}
      {loading[activeTab] ? (
        <Container className="py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading {activeTab}...</p>
          </div>
        </Container>
      ) : (
        renderTabContent()
      )}
    </Container>
  );
}
