import { useEffect, useState } from "react";
import { practice, toBucketsSets } from "../../logic/algorithm";
import { AnswerDifficulty, Flashcard } from "../../logic/flashcards";
import styles from "./css/Card.module.css";
import { startDetection, cleanupDetection } from "./detect/detection";
import { getFlashcards, updateFlashcard } from "../../backend/store/db";

type FlashcardProps = {
  day: number;
  showAnswer: boolean;
  currentCard: React.RefObject<Record<number, Flashcard>>;
  setCardsLeft: React.Dispatch<React.SetStateAction<number>>;
  setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Card({
  day,
  showAnswer,
  currentCard,
  setCardsLeft,
  setShowAnswer,
}: FlashcardProps) {
  const [index, setIndex] = useState(0);
  const [todayCards, setTodayCards] = useState<Flashcard[]>([]);
  const [detectedDifficulty, setDetectedDifficulty] = useState<string | null>(
    null
  );

  // Gesture detection handler
  useEffect(() => {
    const handleGesture = async (event: Event) => {
      const gesture = (event as CustomEvent<string>).detail;

      const difficultyMap: Record<string, string> = {
        "Thumbs Up": "Easy",
        "Raised Hand": "Medium",
        "Thumbs Down": "Hard",
      };

      if (difficultyMap[gesture]) {
        setDetectedDifficulty(() => difficultyMap[gesture]);

        // Update flashcard difficulty in DB
        const updatedCards = [...todayCards];
        await updateFlashcard({
          flashcard: updatedCards[index],
          difficulty:
            gesture === "Thumbs Up"
              ? AnswerDifficulty.Easy
              : gesture === "Raised Hand"
              ? AnswerDifficulty.Hard
              : AnswerDifficulty.Wrong,
        });
      }
    };

    if (showAnswer) {
      window.addEventListener("gestureDetected", handleGesture);
      startDetection().catch(console.error);
    }

    return () => {
      window.removeEventListener("gestureDetected", handleGesture);
      if (showAnswer) cleanupDetection();
    };
  }, [showAnswer]);

  // Load today's cards
  useEffect(() => {
    const getTodayCards = async () => {
      if (day === 0) {
        const cards_ = await getFlashcards();
        const todayCards_ = cards_.get(0);

        todayCards_ && setTodayCards(() => Array.from(todayCards_));
      } else {
        const cards_ = await getFlashcards();

        setTodayCards(() => Array.from(practice(day, toBucketsSets(cards_))));
      }
    };

    getTodayCards();
    setIndex(() => 0);
  }, [day]);

  // Update cards count
  useEffect(() => {
    setCardsLeft(() => todayCards.length);
  }, [todayCards]);

  // Handle next question navigation
  const moveToNextQuestion = () => {
    setShowAnswer(() => false);
    setDetectedDifficulty(() => null);

    setIndex((prev) => {
      if (todayCards.length === 0) return prev;
      return prev + 1;
    });

    setCardsLeft((prev) => prev - 1);
  };

  // Reset detection when index changes
  useEffect(() => {
    setDetectedDifficulty(() => null);
  }, [index]);

  if (!todayCards.length || index >= todayCards.length) {
    return (
      <div className={styles["card--none"]}>
        <p>No more cards to practice today!</p>
      </div>
    );
  }

  currentCard.current[0] = todayCards[index];

  return (
    <div className={styles["wrapper"]}>
      <p className={styles["counter"]}>
        Card {index + 1} of {todayCards.length}
      </p>

      <div className={styles["card-container"]}>
        {!showAnswer ? (
          <div className={styles["card"]}>
            <p>🤔 {currentCard.current[0]?.front}</p>
          </div>
        ) : (
          <div className={styles["card--answer"]}>
            <p>💡 {currentCard.current[0]?.back}</p>

            {detectedDifficulty && (
              <div className={styles["difficulty-display"]}>
                Difficulty: {detectedDifficulty}
              </div>
            )}

            <button
              className={styles["next-button"]}
              onClick={moveToNextQuestion}
              disabled={todayCards.length === 0}
            >
              Next Question →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
