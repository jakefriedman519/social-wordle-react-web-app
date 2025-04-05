import { useEffect, useState } from "react";
import WordleGame from "./WordleGame/WordleGame";
import * as client from "./client";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Toast, ToastContainer } from "react-bootstrap";
import DatePickerModal from "./DatePickerModal";

export default function Worldes() {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  // TODO in tournaments dont use this component, just use WordleGame
  const [targetWord, setTargetWord] = useState<string>("");
  const [maxGuesses, setMaxGuesses] = useState<number>(6);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{
    show: boolean;
    toastHeader: string;
    toastBody: string;
  }>({
    show: false,
    toastHeader: "",
    toastBody: "",
  });

  const fetchWordleByDay = async (day: string) => {
    try {
      const response = await client.getWordleByDay(day);
      setTargetWord(response.solution.toUpperCase());
      setMaxGuesses(response?.maxGuesses || 6);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      setToast({
        show: true,
        toastHeader: "Error",
        toastBody: "Could not fetch wordle for the day",
      });
    }
  };

  const fetchUserWordleGuess = async () => {
    const response = await client.getUserWordleGuessesByDate(
      day || new Date().toISOString().split("T")[0]
    );
    if (response) {
      setGuesses(response.guesses);
      setCurrentGuess(response.currentGuess);
      setGameOver(response.gameOver);
    }
  };

  const datePickerHandler = (date: string) => {
    navigate(`/wordle/${date}`);
    window.location.reload(); // Hacky, maybe we can remove once we fetch the user guess
  };

  const handleGuess = async () => {
    await client.updateUserWordleGuessByDate({
      date: day || new Date().toISOString().split("T")[0],
      guesses,
      currentGuess,
      gameOver,
    });
  };

  const handleGameOver = () => {
    setToast({
      show: true,
      toastHeader: "Game Over",
      toastBody: `${guesses[guesses.length - 1] === targetWord ? 'You won!' : ''} The word was ${targetWord}`,
    });
  };

  useEffect(() => {
    // If day is passed in the URL, use that to fetch the wordle NEEDS TO BE IN YYYY-MM-DD FORMAT, else use the current date
    fetchWordleByDay(day || new Date().toISOString().split("T")[0]);
    fetchUserWordleGuess();
  }, [day]);

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light py-5">
      {isLoading ? (
        <>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </>
      ) : (
        <>
          <h1 className="display-4 fw-bold mb-5">
            Social Wordle ~ {day || new Date().toISOString().split("T")[0]}
          </h1>
          <WordleGame
            targetWord={targetWord}
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
          {/* TODO add quick button to go to next and previous, also move this to a better place */}
          {/* TODO use this modal in leaderborads too to see leaderboard for specific date */}
          <DatePickerModal datePickerHandler={datePickerHandler} /> 
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
              {toast.toastBody && <Toast.Body>{toast.toastBody}</Toast.Body>}
            </Toast>
          </ToastContainer>
        </>
      )}
    </div>
  );
}
