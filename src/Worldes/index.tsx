import { useEffect, useState } from "react";
import WordleGame from "./WordleGame/WordleGame";
import * as client from "./client";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Toast, ToastContainer } from "react-bootstrap";
import DatePickerModal from "../shared/components/DatePickerModal";

// TODO makle this work for custom wordles -> probably move this/make generic, but more likely move it
export default function Worldes() {
  const { day, wordleId } = useParams<{ day?: string; wordleId?: string }>();
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
    refreshLink: boolean;
  }>({
    show: false,
    toastHeader: "",
    toastBody: "",
    refreshLink: false,
  });

  const fetchWordleByDay = async (day: string) => {
    try {
      const response = await client.getWordleByDay(day);
      setTargetWord(response.solution.toUpperCase());
      setMaxGuesses(response?.maxGuesses || 6);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setToast({
        show: true,
        toastHeader: "Error",
        toastBody:
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Could not fetch wordle",
        refreshLink: true,
      });
    }
  };

  const fetchUserWordleGuess = async () => {
    const response = await client.getUserWordleGuessesByDate(
      day || new Date().toISOString().split("T")[0]
    );
    if (response) {
      setGuesses(response.guesses);
      setGameOver(response.gameOver);
    }
  };

  const datePickerHandler = (date: string) => {
    navigate(`/wordle/${date}`);
    window.location.reload(); // Hacky, maybe we can remove once we fetch the user guess
  };

  const handleGuess = async () => {
    if (guesses.length) {
      await client.updateUserWordleGuessByDate({
        createdDate: day || new Date().toISOString().split("T")[0],
        guesses,
        completed: gameOver && guesses[guesses.length - 1] === targetWord,
      });
    }
  };

  const handleGameOver = () => {
    setToast({
      show: true,
      toastHeader: "Game Over",
      toastBody: `${
        guesses[guesses.length - 1] === targetWord ? "You won!" : ""
      } The word was ${targetWord}`,
      refreshLink: false,
    });
  };

  useEffect(() => {
    if (wordleId) {
      // TODO fetch wordle by id & would need to chenge fetchUserWordleGuess to support custom wordles
      return;
    }
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
            {wordleId
              ? "Custom Wordle"
              : day || new Date().toISOString().split("T")[0]}
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
              {toast.toastBody && (
                <Toast.Body>
                  {toast.toastBody}
                  {toast.refreshLink && (
                    <>
                      <br />
                      <a href="/wordle">Return to today</a>
                    </>
                  )}
                </Toast.Body>
              )}
            </Toast>
          </ToastContainer>
        </>
      )}
    </div>
  );
}
