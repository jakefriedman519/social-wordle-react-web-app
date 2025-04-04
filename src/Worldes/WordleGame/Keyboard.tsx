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
    // Default color for keys that haven't been guessed
    let keyStatus = "btn-outline-dark";
    let hasBeenGuessed = false;

    // Check each guess from newest to oldest
    for (let i = guesses.length - 1; i >= 0; i--) {
      const guess = guesses[i];

      // Check if the key is in this guess
      for (let j = 0; j < guess.length; j++) {
        if (guess[j].toUpperCase() === key) {
          hasBeenGuessed = true;

          // If the letter is in the correct position, it's green
          if (guess[j] === targetWord[j]) {
            return "bg-success text-white";
          }

          // If the letter is in the word but in the wrong position
          if (targetWord.includes(guess[j])) {
            keyStatus = "bg-warning text-dark";
          } else {
            // If the letter is not in the word
            keyStatus = "bg-secondary text-white";
          }
        }
      }

      // If we've found a status for this key, no need to check older guesses
      if (hasBeenGuessed) break;
    }
    return keyStatus;
  };

  return (
    <div className="mb-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="d-flex justify-content-center mb-2">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`btn ${getKeyColor(key)} me-1 ${
                key.length > 1 ? "px-2 py-1 fs-6" : "px-3 py-2"
              }`}
            >
              {key === "BACKSPACE" ? "←" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
