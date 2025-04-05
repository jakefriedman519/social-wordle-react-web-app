import { useEffect, useState } from "react";
import WordleGame from "./WordleGame/WordleGame";
import * as client from "./client";

export default function Worldes() {
  // TODO pull from backend, have this component take an optional date i think which we can use to pull from backend
  // TODO in tournaments dont use this component, just use WordleGame
  const [targetWord, setTargetWord] = useState<string>("APPLE"); // TODO remove default value
  const [maxGuesses, setMaxGuesses] = useState<number>(6);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);

  const fetchWordleByDay = async (day: string = Date.now().toString()) => {
    try {
      const response = await client.getWordleByDay(day);
      setTargetWord(response.targetWord);
      setMaxGuesses(response.maxGuesses);
    } catch (error) {
      console.error("Error fetching Wordle data:", error);
    }
  };

  const fetchUserWordleGuess = async () => {
    // TODO fetch user wordle guess
    // TODO if user has not played wordle today, fetch wordle by day
    // TODO if user has played wordle today, fetch user wordle guess
    // TODO set targetWord to the word that the user guessed
  };

  useEffect(() => {
    fetchWordleByDay();
    fetchUserWordleGuess();
  }, []);

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light py-5">
      <h1 className="display-4 fw-bold mb-5">Social Wordle</h1>
      <WordleGame
        targetWord={targetWord}
        maxGuesses={maxGuesses}
        guesses={guesses}
        currentGuess={currentGuess}
        gameOver={gameOver}
        setGuesses={setGuesses}
        setCurrentGuess={setCurrentGuess}
        setGameOver={setGameOver}
      />
    </div>
  );
}
