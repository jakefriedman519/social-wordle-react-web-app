import { useEffect, useState } from "react";
import WordleGame from "./WordleGame/WordleGame";
import * as client from "./client";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spinner, Toast, ToastContainer } from "react-bootstrap";
import DatePickerModal from "../shared/components/DatePickerModal";
import { BsChevronLeft, BsCalendar, BsChevronRight } from "react-icons/bs";

export default function Worldes() {
  const { day } = useParams<{ day?: string }>();
  const navigate = useNavigate();
  // TODO in tournaments dont use this component, just use WordleGame
  const [targetWord, setTargetWord] = useState<string>("");
  const [maxGuesses, setMaxGuesses] = useState<number>(6);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
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

  const fetchWordleByDay = async (day: string) => {
    try {
      const response = await client.getWordleByDay(day);
      setTargetWord(response.solution.toUpperCase());
      setMaxGuesses(6);
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
    setGuesses(response?.guesses ?? []);
    setCurrentGuess(
      response?.guesses ? response.guesses[response.guesses.length - 1] : ""
    );
    setTimeSpent(response?.timeSpent ?? 0);
    setGameOver(response?.completed ?? false);
  };

  const handleDateChange = (date: Date) => {
    setIsDatePickerOpen(false);
    const dateString = date.toISOString().split("T")[0];
    navigate(`/wordle/${dateString}`);
    setToast({
      show: false,
      toastHeader: "",
      toastBody: "",
      refreshLink: false,
    });
  };

  const handleGuess = async () => {
    if (guesses.length) {
      await client.updateUserWordleGuessByDate({
        createdDate: day || new Date().toISOString().split("T")[0],
        guesses,
        completed: guesses[guesses.length - 1] === targetWord,
        timeSpent,
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
    // If day is passed in the URL, use that to fetch the wordle NEEDS TO BE IN YYYY-MM-DD FORMAT, else use the current date
    fetchWordleByDay(day || new Date().toISOString().split("T")[0]);
    fetchUserWordleGuess();
  }, [day]);

  // Initialize timer if game is not over
  useEffect(() => {
    // Realisitcally this should hit the backend every second, but we'll just do it when the user submits a guess as to not overwhelm the server
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
          <h1 className="display-4 fw-bold my-5">
            {day || new Date().toISOString().split("T")[0]}
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

          {/* Date Navigation and Timer */}
          <div className="d-flex flex-column align-items-center mb-4">
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  const previousDay = new Date(
                    day || new Date().toISOString().split("T")[0]
                  );
                  previousDay.setDate(previousDay.getDate() - 1);
                  handleDateChange(previousDay);
                }}
                aria-label="Previous day"
              >
                <BsChevronLeft style={{ fontSize: "16px" }} />
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setIsDatePickerOpen(true)}
                className="d-flex align-items-center gap-2"
              >
                <BsCalendar style={{ fontSize: "16px" }} />
                <span className="d-none d-sm-inline">Change Date</span>
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  const previousDay = new Date(
                    day || new Date().toISOString().split("T")[0]
                  );
                  previousDay.setDate(previousDay.getDate() + 1);
                  handleDateChange(previousDay);
                }}
                disabled={day === new Date().toISOString().split("T")[0]}
                aria-label="Next day"
              >
                <BsChevronRight style={{ fontSize: "16px" }} />
              </Button>
            </div>

            {/* Timer Display */}
            <div className="fs-6 py-2 px-3">Time spent: {timeSpent}</div>
          </div>

          {/* Date Picker */}
          <DatePickerModal
            isOpen={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            onDateChange={handleDateChange}
          />

          {/* Toast Notification */}
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
    </>
  );
}
