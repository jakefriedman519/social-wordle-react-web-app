// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { setCurrentUser } from "./reducer";
// import * as client from "./client";
// import { RootState } from "../store";
// import { Button } from "react-bootstrap";

// // TODO make this work and pull info, allow users to edit their profile & make public profiles so u can see their info from leaderboards etc
// export default function Profile() {
//   const [profile, setProfile] = useState<object>({});
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { currentUser } = useSelector((state: RootState) => state.accountReducer);

//   const fetchProfile = () => {
//     if (!currentUser) return navigate("/sign-in");
//     setProfile(currentUser);
//   };

//   const signout = async () => {
//     await client.signout();
//     dispatch(setCurrentUser(null));
//     navigate("/sign-in");
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   return (
//     <div>
//       <h3>Profile</h3>
//       {profile && (
//         <div>
//           <Button
//             onClick={signout}
//             className="btn btn-danger w-100"
//           >
//             Sign out
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import type React from "react";

import { useState, useEffect } from "react";
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

// User type based on your schema
interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
  role: "ADMIN" | "USER";
  section: string;
  lastActivity: Date;
  totalActivity: string;
}

// Wordle type for past and created wordles
interface Wordle {
  _id: string;
  uuid: string;
  createdBy: string;
  word: string;
  dateCreated: Date;
  plays: number;
  isPublic: boolean;
}

// Tournament type
interface Tournament {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  participants: number;
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
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [pastWordles, setPastWordles] = useState<Wordle[]>([]);
  const [createdWordles, setCreatedWordles] = useState<Wordle[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [newWordleWord, setNewWordleWord] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [shareLink, setShareLink] = useState("");
  const [showShareAlert, setShowShareAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("stats");

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch("/api/user/profile");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        setUser(userData);
        setEditedUser(userData);
        setLoading(false);
      } catch {
        setError("Error loading profile data");
        setLoading(false);

        // For demo purposes, set mock data
        setUser({
          _id: "123456",
          username: "wordlemaster",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          dob: new Date("1990-01-01"),
          role: "USER",
          section: "Games",
          lastActivity: new Date(),
          totalActivity: "120h",
        });
        setEditedUser({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
        });
      }
    };

    const fetchWordles = async () => {
      try {
        // Replace with your actual API calls
        const pastResponse = await fetch("/api/wordles/played");
        const createdResponse = await fetch("/api/wordles/created");

        if (!pastResponse.ok || !createdResponse.ok)
          throw new Error("Failed to fetch wordles");

        const pastData = await pastResponse.json();
        const createdData = await createdResponse.json();

        setPastWordles(pastData);
        setCreatedWordles(createdData);
      } catch {
        // For demo purposes, set mock data
        setPastWordles([
          {
            _id: "w1",
            uuid: "abc123",
            createdBy: "system",
            word: "PIANO",
            dateCreated: new Date("2023-05-15"),
            plays: 245,
            isPublic: true,
          },
          {
            _id: "w2",
            uuid: "def456",
            createdBy: "system",
            word: "GHOST",
            dateCreated: new Date("2023-05-20"),
            plays: 189,
            isPublic: true,
          },
          {
            _id: "w3",
            uuid: "ghi789",
            createdBy: "friend1",
            word: "BEACH",
            dateCreated: new Date("2023-05-25"),
            plays: 56,
            isPublic: true,
          },
        ]);

        setCreatedWordles([
          {
            _id: "cw1",
            uuid: "jkl012",
            createdBy: "123456",
            word: "TIGER",
            dateCreated: new Date("2023-06-01"),
            plays: 42,
            isPublic: true,
          },
          {
            _id: "cw2",
            uuid: "mno345",
            createdBy: "123456",
            word: "CLOUD",
            dateCreated: new Date("2023-06-10"),
            plays: 28,
            isPublic: true,
          },
        ]);
      }
    };

    const fetchTournaments = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch("/api/tournaments/user");
        if (!response.ok) throw new Error("Failed to fetch tournaments");
        const data = await response.json();
        setTournaments(data);
      } catch {
        // For demo purposes, set mock data
        setTournaments([
          {
            _id: "t1",
            name: "Summer Wordle Challenge",
            startDate: new Date("2023-06-01"),
            endDate: new Date("2023-06-30"),
            participants: 156,
            rank: 12,
            score: 89,
          },
          {
            _id: "t2",
            name: "Weekly Word Battle",
            startDate: new Date("2023-07-01"),
            endDate: new Date("2023-07-07"),
            participants: 78,
            rank: 5,
            score: 95,
          },
          {
            _id: "t3",
            name: "Vocabulary Masters",
            startDate: new Date("2023-07-15"),
            endDate: new Date("2023-07-22"),
            participants: 120,
            rank: 8,
            score: 92,
          },
        ]);
      }
    };

    const fetchStats = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch("/api/user/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch {
        // For demo purposes, set mock data
        setStats({
          gamesPlayed: 87,
          gamesWon: 72,
          currentStreak: 8,
          maxStreak: 15,
          averageGuesses: 3.7,
          distribution: [2, 8, 25, 20, 12, 5],
        });
      }
    };

    fetchUserData();
    fetchWordles();
    fetchTournaments();
    fetchStats();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      handleSaveProfile();
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      // Replace with your actual API call
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      // Update the user state with edited values
      setUser({
        ...user!,
        ...editedUser,
      });

      setIsEditing(false);
    } catch {
      setError("Error updating profile");
      // For demo purposes, just update the user state
      setUser({
        ...user!,
        ...editedUser,
      });
      setIsEditing(false);
    }
  };

  const handleCreateWordle = async () => {
    if (!newWordleWord.trim()) {
      setError("Please enter a valid word");
      return;
    }

    try {
      // Replace with your actual API call
      const response = await fetch("/api/wordles/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: newWordleWord.toUpperCase(),
          isPublic,
        }),
      });

      if (!response.ok) throw new Error("Failed to create wordle");

      // const newWordle = await response.json();

      // For demo purposes, create a mock wordle
      const mockWordle = {
        _id: `cw${createdWordles.length + 1}`,
        uuid: Math.random().toString(36).substring(2, 10),
        createdBy: user?._id || "123456",
        word: newWordleWord.toUpperCase(),
        dateCreated: new Date(),
        plays: 0,
        isPublic,
      };

      setCreatedWordles([mockWordle, ...createdWordles]);
      setNewWordleWord("");
      setShareLink(`${window.location.origin}/wordle/${mockWordle.uuid}`);
      setShowShareAlert(true);

      // Hide the alert after 5 seconds
      setTimeout(() => {
        setShowShareAlert(false);
      }, 5000);
    } catch {
      setError("Error creating wordle");
    }
  };

  const handleShareWordle = (uuid: string) => {
    const link = `${window.location.origin}/wordle/${uuid}`;
    setShareLink(link);
    setShowShareAlert(true);

    // Copy to clipboard
    navigator.clipboard
      .writeText(link)
      .then(() => {
        // Success message is shown via the alert
      })
      .catch(() => {
        setError("Failed to copy link to clipboard");
      });

    // Hide the alert after 5 seconds
    setTimeout(() => {
      setShowShareAlert(false);
    }, 5000);
  };

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
                <Card.Body>
                  <div className="d-flex justify-content-between mb-3">
                    <div className="text-center">
                      <h2>{stats?.gamesPlayed || 0}</h2>
                      <p className="text-muted mb-0">Played</p>
                    </div>
                    <div className="text-center">
                      <h2>{stats?.gamesWon || 0}</h2>
                      <p className="text-muted mb-0">Won</p>
                    </div>
                    <div className="text-center">
                      <h2>
                        {stats
                          ? Math.round(
                              (stats.gamesWon / stats.gamesPlayed) * 100
                            )
                          : 0}
                        %
                      </h2>
                      <p className="text-muted mb-0">Win Rate</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="text-center">
                      <h2>{stats?.currentStreak || 0}</h2>
                      <p className="text-muted mb-0">Current Streak</p>
                    </div>
                    <div className="text-center">
                      <h2>{stats?.maxStreak || 0}</h2>
                      <p className="text-muted mb-0">Max Streak</p>
                    </div>
                    <div className="text-center">
                      <h2>{stats?.averageGuesses?.toFixed(1) || 0}</h2>
                      <p className="text-muted mb-0">Avg. Guesses</p>
                    </div>
                  </div>
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
              <h5 className="mb-0">Wordles You've Played</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {pastWordles.length > 0 ? (
                pastWordles.map((wordle) => (
                  <ListGroup.Item
                    key={wordle._id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h6 className="mb-0">{wordle.word}</h6>
                      <small className="text-muted">
                        <span className="me-1">📅</span>
                        {new Date(wordle.dateCreated).toLocaleDateString()}
                      </small>
                    </div>
                    <div>
                      <a href={`/wordle/${wordle.uuid}`}>
                        <Button variant="outline-primary" size="sm">
                          Play Again
                        </Button>
                      </a>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>
                  You haven't played any wordles yet.
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        );
      case "tournaments":
        return (
          <Card>
            <Card.Header>
              <h5 className="mb-0">Your Tournament History</h5>
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
                        {new Date(
                          tournament.startDate
                        ).toLocaleDateString()} -{" "}
                        {new Date(tournament.endDate).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="text-end">
                      <Badge bg="primary" className="me-2">
                        {tournament.participants} Participants
                      </Badge>
                      {tournament.rank && (
                        <Badge
                          bg={tournament.rank <= 3 ? "warning" : "secondary"}
                        >
                          <span className="me-1">🏆</span>
                          Rank: {tournament.rank}
                        </Badge>
                      )}
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>
                  You haven't participated in any tournaments yet.
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        );
      case "createWordle":
        return (
          <>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Create Your Own Wordle</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Enter a 5-letter word</Form.Label>
                    <Form.Control
                      type="text"
                      value={newWordleWord}
                      onChange={(e) =>
                        setNewWordleWord(
                          e.target.value.slice(0, 5).replace(/[^a-zA-Z]/g, "")
                        )
                      }
                      placeholder="Enter a 5-letter word"
                      maxLength={5}
                    />
                    <Form.Text className="text-muted">
                      Your word must be exactly 5 letters long.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="isPublic"
                      label="Make this wordle public (visible on leaderboards)"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    onClick={handleCreateWordle}
                    disabled={newWordleWord.length !== 5}
                  >
                    <span className="me-1">➕</span>
                    Create Wordle
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <Card className="mt-4">
              <Card.Header>
                <h5 className="mb-0">Your Created Wordles</h5>
              </Card.Header>
              <ListGroup variant="flush">
                {createdWordles.length > 0 ? (
                  createdWordles.map((wordle) => (
                    <ListGroup.Item
                      key={wordle._id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h6 className="mb-0">{wordle.word}</h6>
                        <small className="text-muted">
                          <span className="me-1">📅</span>
                          Created:{" "}
                          {new Date(wordle.dateCreated).toLocaleDateString()}
                          <span className="ms-2 me-1">⏱️</span>
                          Plays: {wordle.plays}
                        </small>
                      </div>
                      <div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleShareWordle(wordle.uuid)}
                        >
                          <span className="me-1">📤</span>
                          Share
                        </Button>
                        <a
                          href={`/wordle/leaderboard/${wordle.uuid}`}
                        >
                          <Button variant="outline-secondary" size="sm">
                            <span className="me-1">🏆</span>
                            Leaderboard
                          </Button>
                        </a>
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>
                    You haven't created any wordles yet.
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading profile...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}
      {showShareAlert && (
        <Alert
          variant="success"
          onClose={() => setShowShareAlert(false)}
          dismissible
        >
          <Alert.Heading>Wordle Link Ready to Share!</Alert.Heading>
          <p>
            Your wordle link has been copied to clipboard:{" "}
            <strong>{shareLink}</strong>
          </p>
          <p>
            Share this link with friends to let them play your custom wordle!
          </p>
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 className="mb-0">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-muted">@{user?.username}</p>
                </div>
                <Button
                  variant={isEditing ? "success" : "outline-primary"}
                  onClick={handleEditToggle}
                >
                  {isEditing ? (
                    <>
                      <span className="me-1">✓</span> Save
                    </>
                  ) : (
                    <>
                      <span className="me-1">✏️</span> Edit Profile
                    </>
                  )}
                </Button>
              </div>

              {isEditing ? (
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={editedUser.firstName || ""}
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
                          value={editedUser.lastName || ""}
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
                      value={editedUser.email || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={
                        editedUser.dob
                          ? new Date(editedUser.dob).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Section</Form.Label>
                    <Form.Control
                      type="text"
                      name="section"
                      value={editedUser.section || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Form>
              ) : (
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Email:</strong> {user?.email}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong>{" "}
                      {user?.dob
                        ? new Date(user.dob).toLocaleDateString()
                        : "Not set"}
                    </p>
                    <p>
                      <strong>Role:</strong> {user?.role}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Section:</strong> {user?.section || "Not set"}
                    </p>
                    <p>
                      <strong>Last Activity:</strong>{" "}
                      {user?.lastActivity
                        ? new Date(user.lastActivity).toLocaleString()
                        : "Unknown"}
                    </p>
                    <p>
                      <strong>Total Activity:</strong>{" "}
                      {user?.totalActivity || "0h"}
                    </p>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Replace Tabs and Tab with Nav */}
      <Nav
        variant="tabs"
        className="mb-4"
        activeKey={activeTab}
        onSelect={(k) => k && setActiveTab(k)}
      >
        <Nav.Item>
          <Nav.Link eventKey="stats">My Stats</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="pastWordles">Past Wordles</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="tournaments">Tournaments</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="createWordle">Create Wordle</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Render content based on active tab */}
      {renderTabContent()}
    </Container>
  );
}
