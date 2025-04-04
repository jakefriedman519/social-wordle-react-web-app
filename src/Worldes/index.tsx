import { useState } from "react";
import WordleGame from "./WordleGame/WordleGame";

export default function Worldes() {
  // TODO pull from backend, have this component take an optional date i think which we can use to pull from backend
  // TODO in tournaments dont use this component, just use WordleGame
  const targetWord = "APPLE"; // Example target word
  const maxGuesses = 6; // Example max guesses
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);

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
