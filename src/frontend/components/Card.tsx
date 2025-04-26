import { useEffect, useRef, useState } from "react";
import { useFlashcardsContext } from "../../backend/store/flashcards-context";
import { toBucketsSets } from "../../logic/algorithm";
import { Flashcard } from "../../logic/flashcards";
import styles from "./css/Card.module.css";

type FlashcardProps = {
  day: number;
  showAnswer: boolean;
  currentCard: React.RefObject<Record<number, Flashcard>>;
  setCurrentCardsCount: React.Dispatch<React.SetStateAction<number>>;
};

export default function Card({
  day,
  showAnswer,
  currentCard,
  setCurrentCardsCount,
}: FlashcardProps) {
  const hasMounted = useRef(false);
  const [index, setIndex] = useState(0);
  const [todayCards, setTodayCards] = useState<Flashcard[]>([]);

  const ctx = useFlashcardsContext();
  function getTodayCards() {
    if (day === 0) {
      const cards = ctx.flashcards.get(0);
      if (cards) setTodayCards(Array.from(cards));
    } else {
      setTodayCards(
        Array.from(ctx.practice(day, toBucketsSets(ctx.flashcards)))
      );
    }
  }

  useEffect(() => {
    getTodayCards();
  }, [day]);

  useEffect(() => {
    setCurrentCardsCount(todayCards.length);
  }, [todayCards]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (!showAnswer) {
      setIndex((prevIndex) => prevIndex + 1);
    }
  }, [showAnswer]);

  if (index >= todayCards.length) {
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
        Card {index + 1} out of {todayCards.length}
      </p>
      {!showAnswer ? (
        <div className={styles["card"]}>
          <p>🤔 {currentCard.current[0]?.front}</p>
        </div>
      ) : (
        <div className={styles["card--answer"]}>
          <p>💡 {currentCard.current[0]?.back}</p>
        </div>
      )}
    </div>
  );
}
