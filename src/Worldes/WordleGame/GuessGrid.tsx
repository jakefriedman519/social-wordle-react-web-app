interface GuessGridProps {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
  maxGuesses: number;
}

export function GuessGrid({
  guesses,
  currentGuess,
  targetWord,
  maxGuesses = 6,
}: GuessGridProps) {
  const getLetterColor = (
    letter: string,
    index: number,
    guessIndex: number
  ) => {
    // If this isn't a completed guess row, return light background
    if (guessIndex >= guesses.length) return "bg-light";

    const guess = guesses[guessIndex];

    // If the letter is in the correct position, it's green
    if (letter === targetWord[index]) return "bg-success text-white";

    // If the letter is in the word but in the wrong position, check frequency
    if (targetWord.includes(letter)) {
      // Count how many times this letter appears in the target word
      const letterFrequencyInTarget = targetWord
        .split("")
        .filter((l) => l === letter).length;

      // Count how many times this letter appears in the correct position in the guess
      const correctPositionsCount = guess
        .split("")
        .filter((l, i) => l === letter && targetWord[i] === l).length;

      // Count how many times this letter has appeared before the current position in the guess
      const previousOccurrencesCount = guess
        .substring(0, index)
        .split("")
        .filter((l) => l === letter).length;

      // If we haven't exceeded the frequency limit (accounting for correct positions)
      if (
        previousOccurrencesCount + correctPositionsCount <
        letterFrequencyInTarget
      ) {
        return "bg-warning text-dark";
      }
    }

    // Otherwise, the letter is not in the word or exceeds frequency
    return "bg-secondary text-white";
  };
  return (
    <div className="mb-4">
      {[...Array(maxGuesses)].map((_, rowIndex) => {
        // Determine if this is the current guess row
        const isCurrentGuessRow = rowIndex === guesses.length;

        return (
          <div key={rowIndex} className="d-flex mb-2">
            {[...Array(targetWord.length)].map((_, colIndex) => {
              // For the current guess row, only show letters that have been typed
              let letter = "";
              if (isCurrentGuessRow) {
                // Only show letters up to what has been typed in the current guess
                letter =
                  colIndex < currentGuess.length ? currentGuess[colIndex] : "";
              } else {
                // For completed guesses or future guesses
                letter = (guesses[rowIndex] || "")[colIndex] || "";
              }

              return (
                <div
                  key={colIndex}
                  className={`border border-dark rounded me-2 ${getLetterColor(
                    letter,
                    colIndex,
                    rowIndex
                  )} d-flex justify-content-center align-items-center`}
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="fs-4 fw-bold">{letter.toUpperCase()}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
