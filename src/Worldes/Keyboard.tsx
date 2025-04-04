import { Button } from "react-bootstrap";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  guesses: string[];
  targetWord: string;
}

export function Keyboard({ onKeyPress, guesses, targetWord }: KeyboardProps) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  const getKeyColor = (key: string) => {
    const flatGuesses = guesses.join("");
    if (targetWord.includes(key) && flatGuesses.includes(key)) {
      return "bg-yellow-500 hover:bg-yellow-600";
    }
    if (
      guesses.some((guess) =>
        guess
          .split("")
          .some((letter, i) => letter === key && targetWord[i] === key)
      )
    ) {
      return "bg-green-500 hover:bg-green-600";
    }
    if (flatGuesses.includes(key)) {
      return "bg-gray-400 hover:bg-gray-500";
    }
    return "bg-gray-200 hover:bg-gray-300";
  };

  return (
    <div className="flex flex-col items-center">
      {rows.map((row, i) => (
        <div key={i} className="flex mb-2">
          {row.map((key) => (
            <Button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`mx-0.5 ${
                key.length > 1 ? "px-2 text-xs" : "w-10"
              } ${getKeyColor(key)}`}
            >
              {key === "BACKSPACE" ? "←" : key}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}
