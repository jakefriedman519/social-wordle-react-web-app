import { useEffect, useState } from "react";
import WordleGame from "./WordleGame/WordleGame";
import * as client from "./client";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import DatePickerModal from "./DatePickerModal";

export default function Worldes() {
  // TODO in tournaments dont use this component, just use WordleGame
  const [targetWord, setTargetWord] = useState<string>(""); // TODO remove default value
  const [maxGuesses, setMaxGuesses] = useState<number>(6);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();

  const fetchWordleByDay = async (day: string) => {
    try {
      const response = await client.getWordleByDay(day);
      setTargetWord(response.solution.toUpperCase());
      setMaxGuesses(response?.maxGuesses || 6);
      setIsLoading(false);
    } catch (error) {
      // TODO throw toast if error
      console.error("Error fetching Wordle data:", error);
    }
  };

  const fetchUserWordleGuess = async () => {
    // TODO make this endpoint work by using the user session id
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
    window.location.reload();
  };

  const handleEnter = () => {
    // TODO handle enter key press
    // Save the guesses to the database (use patch for the wordleGuesses collection based on userId and date IF it exists)
  };

  useEffect(() => {
    // If day is passed in the URL, use that to fetch the wordle NEEDS TO BE IN YYYY-MM-DD FORMAT
    // Else use the current date
    fetchWordleByDay(day || new Date().toISOString().split("T")[0]);
    fetchUserWordleGuess();
  }, []);

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light py-5">
      {isLoading ? (
        <>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </>
      ) : (
        // TODO add a date picker so that the user can select a date and play the wordle for that date
        // TODO make this a modal, have the same modal in leaderboards to see the rankings for the other wordles
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
            handleEnter={handleEnter}
          />
          {/* TODO add quick button to go to next and previous, also move this to a better place */}
          <DatePickerModal datePickerHandler={datePickerHandler} />
        </>
      )}
    </div>
  );
}
