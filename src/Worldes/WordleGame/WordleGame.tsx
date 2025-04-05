import { useState, useEffect } from "react";
import { Keyboard } from "./Keyboard";
import { GuessGrid } from "./GuessGrid";

export default function WordleGame({
  targetWord,
  guesses,
  currentGuess,
  maxGuesses,
  gameOver,
  setGuesses,
  setCurrentGuess,
  setGameOver,
}: {
  targetWord: string;
  guesses: string[];
  currentGuess: string;
  maxGuesses: number;
  gameOver: boolean;
  setGuesses: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentGuess: React.Dispatch<React.SetStateAction<string>>;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // This needs to be an object for the react hook to get called when pressing the same key
  const [key, setKey] = useState({ key: "" });

  const isValidKey = (key: string) => {
    const validKeys = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", "ENTER", "BACKSPACE"];
    return validKeys.includes(key);
  };

  const handleKeyPress = (key: string) => {
    if (gameOver || !isValidKey(key)) return;

    if (key === "ENTER") {
      console.log(currentGuess, targetWord);
      if (currentGuess.length === targetWord.length) {
        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess("");

        if (currentGuess === targetWord || newGuesses.length === maxGuesses) {
          setGameOver(true);
        }
      }
    } else if (key === "BACKSPACE") {
      setCurrentGuess((prevGuess) => prevGuess.slice(0, -1));
    } else {
      setCurrentGuess((prevGuess) => prevGuess + key);
    }
  };

  useEffect(() => {
    // Set up event listener for key presses
    const handleKeyDown = (event: KeyboardEvent) => {
      setKey({ key: event.key });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    handleKeyPress(key.key.toUpperCase());
  }, [key]);

  return (
    <>
      <GuessGrid
        guesses={guesses}
        currentGuess={currentGuess}
        targetWord={targetWord}
        maxGuesses={maxGuesses}
      />

      <Keyboard
        onKeyPress={handleKeyPress}
        guesses={guesses}
        targetWord={targetWord}
      />

      {/* TODO: fix this / change Game Over Message */}
      {gameOver && (
        <div className="text-center">
          <p className="fs-4 fw-bold mb-2">
            {guesses.includes(targetWord) ? "You won!" : "Game Over"}
          </p>
          <p className="mb-3">The word was: {targetWord}</p>
        </div>
      )}
    </>
  );
}
