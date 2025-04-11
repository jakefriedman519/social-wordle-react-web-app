import { useEffect, useState } from "react";
import WordleGame from "../WordleGame/WordleGame";
import * as client from "../client";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner, Toast, ToastContainer } from "react-bootstrap";
import { CustomWordle } from ".";

export default function CustomWordleGame() {
  const navigate = useNavigate();
  const { wordleId } = useParams<{ wordleId: string }>();
  const [wordle, setWordle] = useState<CustomWordle>();
  const [maxGuesses, setMaxGuesses] = useState<number>(6);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeSpent, setTimeSpent] = useState<number>(0); // in seconds
  const [toast, setToast] = useState<{
    show: boolean;
    toastHeader: string;
    toastBody: string;
    refreshLink: boolean;
  }>({
    show: false,
    toastHeader: "",
    toastBody: "",
    refreshLink: false,
  });

  const fetchWordle = async () => {
    try {
      const response = await client.getWordleByWordleId(wordleId || "");
      setWordle(response);
      setMaxGuesses(6);
      setIsLoading(false);
    } catch {
      navigate("/wordle/custom");
    }
  };

  const fetchUserWordleGuess = async () => {
    const response = await client.getUserWordleGuessesByWordleId(
      wordleId || ""
    );
    setGuesses(response?.guesses ?? []);
    setCurrentGuess(
      response?.guesses ? response.guesses[response.guesses.length - 1] : ""
    );
    setGameOver(response?.completed ?? false);
    setTimeSpent(response?.timeSpent ?? 0);
  };

  const handleGuess = async () => {
    if (guesses.length && wordleId) {
      await client.updateUserWordleGuessByWordleId({
        wordleId,
        guesses,
        completed: guesses[guesses.length - 1] === wordle?.wordleWord,
        timeSpent,
      });
    }
  };

  const handleGameOver = () => {
    setToast({
      show: true,
      toastHeader: "Game Over",
      toastBody: `${
        guesses[guesses.length - 1] === wordle?.wordleWord ? "You won!" : ""
      } The word was ${wordle?.wordleWord}`,
      refreshLink: true,
    });
  };

  useEffect(() => {
    fetchWordle();
    fetchUserWordleGuess();
  }, [wordleId]);

  // Initialize timer if game is not over
  useEffect(() => {
    if (!gameOver) {
      const intervalId = setInterval(() => {
        setTimeSpent((timeSpent) => timeSpent + 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [gameOver]);

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <h1 className="display-4 fw-bold my-5">{wordle?.title}</h1>
          <WordleGame
            targetWord={wordle?.wordleWord || ""}
            maxGuesses={maxGuesses}
            guesses={guesses}
            currentGuess={currentGuess}
            gameOver={gameOver}
            setGuesses={setGuesses}
            setCurrentGuess={setCurrentGuess}
            setGameOver={setGameOver}
            handleGuess={handleGuess}
            handleGameOver={handleGameOver}
          />
          <div className="fs-6 py-2 px-3">Time spent: {timeSpent}</div>
          <ToastContainer
            position="bottom-end"
            className="p-3"
            style={{ zIndex: 1 }}
          >
            <Toast
              onClose={() => setToast({ ...toast, show: false })}
              show={toast.show}
            >
              <Toast.Header>{toast.toastHeader}</Toast.Header>
              {toast.toastBody && (
                <Toast.Body>
                  {toast.toastBody}
                  {toast.refreshLink && (
                    <>
                      <br />
                      <a href="/wordle/custom">Return to custom wordles</a>
                    </>
                  )}
                </Toast.Body>
              )}
            </Toast>
          </ToastContainer>
        </>
      )}
    </>
  );
}
