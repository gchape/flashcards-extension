import { useEffect, useRef, useState } from "react";
import { useFlashcardsContext } from "../../backend/store/flashcards-context";
import { toBucketsSets } from "../../logic/algorithm";
import { Flashcard } from "../../logic/flashcards";
import styles from "./css/Card.module.css";

// Props for the Card component
type FlashcardProps = {
  day: number; // The current day of practice
  showAnswer: boolean; // Indicates whether the answer is currently being shown
  currentCard: React.RefObject<Record<number, Flashcard>>; // Reference to the current flashcard
  setCurrentCardsCount: React.Dispatch<React.SetStateAction<number>>; // Function to update the count of remaining cards
};

// The Card component displays the current flashcard and handles card progression
export default function Card({
  day, // The current day of practice
  showAnswer, // Determines if the answer is shown
  currentCard, // Reference to the current flashcard
  setCurrentCardsCount, // Updates the count of remaining cards
}: FlashcardProps) {
  const hasMounted = useRef(false); // Tracks if the component has mounted
  const [index, setIndex] = useState(0); // Tracks the index of the current card
  const [todayCards, setTodayCards] = useState<Flashcard[]>([]); // Stores the flashcards for the current day

  const ctx = useFlashcardsContext(); // Access the flashcards context for state management

  // Retrieves the flashcards for the current day
  function getTodayCards() {
    if (day === 0) {
      const cards = ctx.flashcards.get(0); // Get cards from the first bucket
      if (cards) setTodayCards(Array.from(cards));
    } else {
      setTodayCards(
        Array.from(ctx.practice(day, toBucketsSets(ctx.flashcards))) // Get practice cards based on the day and bucket sets
      );
    }
  }

  // Fetches today's cards whenever the day changes
  useEffect(() => {
    getTodayCards();
  }, [day]);

  // Updates the count of remaining cards whenever today's cards change
  useEffect(() => {
    setCurrentCardsCount(todayCards.length);
  }, [todayCards]);

  // Advances to the next card when the answer is hidden
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true; // Skip the first render
      return;
    }

    if (!showAnswer) {
      setIndex((prevIndex) => prevIndex + 1); // Increment the card index
    }
  }, [showAnswer]);

  // If all cards for the day are completed, display a message
  if (index >= todayCards.length) {
    return (
      <div className={styles["card--none"]}>
        <p>No more cards to practice today!</p>
      </div>
    );
  }

  // Set the current card reference to the card at the current index
  currentCard.current[0] = todayCards[index];

  // Render the flashcard UI
  return (
    <div className={styles["wrapper"]}>
      <p className={styles["counter"]}>
        Card {index + 1} out of {todayCards.length} {/* Display the current card number */}
      </p>
      {!showAnswer ? (
        // If the answer is not being shown, display the front of the card
        <div className={styles["card"]}>
          <p>🤔 {currentCard.current[0]?.front}</p>
        </div>
      ) : (
        // If the answer is being shown, display the back of the card
        <div className={styles["card--answer"]}>
          <p>💡 {currentCard.current[0]?.back}</p>
        </div>
      )}
    </div>
  );
}