import { useEffect, useRef, useState } from "react";
import { useFlashcardsContext } from "../../backend/store/flashcards-context";
import { toBucketsSets } from "../../logic/algorithm";
import { Flashcard } from "../../logic/flashcards";
import styles from "./css/Card.module.css";
import { startDetection, cleanupDetection } from "./detect/detection";

type FlashcardProps = {
  day: number;
  showAnswer: boolean;
  currentCard: React.RefObject<Record<number, Flashcard>>;
  setCurrentCardsCount: React.Dispatch<React.SetStateAction<number>>;
  setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Card({
  day,
  showAnswer,
  currentCard,
  setCurrentCardsCount,
  setShowAnswer,
}: FlashcardProps) {
  const [index, setIndex] = useState(0);
  const [todayCards, setTodayCards] = useState<Flashcard[]>([]);
  const [detectedDifficulty, setDetectedDifficulty] = useState<string | null>(null);
  const ctx = useFlashcardsContext();

  // Gesture detection handler
  useEffect(() => {
    const handleGesture = (event: Event) => {
      const gesture = (event as CustomEvent<string>).detail;
      const difficultyMap: Record<string, string> = {
        "Thumbs Up": "Easy",
        "Raised Hand": "Medium",
        "Thumbs Down": "Hard"
      };
      
      if (difficultyMap[gesture]) {
        setDetectedDifficulty(difficultyMap[gesture]);
        
        // Update flashcard difficulty in context
        const updatedCards = [...todayCards];
        updatedCards[index].difficulty = 
          gesture === "Thumbs Up" ? 3 :
          gesture === "Raised Hand" ? 2 : 1;
        ctx.updateFlashcard(updatedCards[index]);
      }
    };

    if (showAnswer) {
      window.addEventListener('gestureDetected', handleGesture);
      startDetection().catch(console.error);
    }

    return () => {
      window.removeEventListener('gestureDetected', handleGesture);
      if (showAnswer) cleanupDetection();
    };
  }, [showAnswer, index, todayCards, ctx]);

  // Load today's cards
  useEffect(() => {
    const getTodayCards = () => {
      if (day === 0) {
        const cards = ctx.flashcards.get(0);
        cards && setTodayCards(Array.from(cards));
      } else {
        setTodayCards(Array.from(ctx.practice(day, toBucketsSets(ctx.flashcards))));
      }
    };
    getTodayCards();
  }, [day, ctx]);

  // Update cards count
  useEffect(() => {
    setCurrentCardsCount(todayCards.length);
  }, [todayCards, setCurrentCardsCount]);

  // Handle next question navigation
  const moveToNextQuestion = () => {
    setShowAnswer(false);
    setDetectedDifficulty(null);
    setIndex(prev => {
      if (todayCards.length === 0) return prev;
      return prev < todayCards.length - 1 ? prev + 1 : 0;
    });
  };

  // Reset detection when index changes
  useEffect(() => {
    setDetectedDifficulty(null);
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