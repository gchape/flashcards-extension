import { useEffect } from "react";
import { AnswerDifficulty, Flashcard } from "../../logic/flashcards";
import Button from "./Button";
import Footer from "./Footer";
import { useFlashcardsContext } from "../../backend/store/flashcards-context";

// Props for the ActionBar component
type ActionBarProps = {
  showAnswer: boolean; // Indicates whether the answer is currently being shown
  currentCardsCount: number; // Number of flashcards remaining for the current day
  setDay: React.Dispatch<React.SetStateAction<number>>; // Function to update the current day
  currentCard: React.RefObject<Record<number, Flashcard>>; // Reference to the current flashcard
  setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>; // Function to toggle the answer visibility
};

// The ActionBar component handles user interactions for flashcard actions
export function ActionBar({
  setDay, // Updates the current day
  showAnswer, // Determines if the answer is shown
  currentCard, // Reference to the current flashcard
  setShowAnswer, // Toggles the answer visibility
  currentCardsCount, // Number of flashcards left for the day
}: ActionBarProps) {
  const ctx = useFlashcardsContext(); // Access the flashcards context for state management

  // Establishes a WebSocket connection to listen for real-time updates
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    // Logs when the WebSocket connection is successfully established
    ws.onopen = () => console.log("WebSocket connection established");

    // Handles incoming WebSocket messages
    ws.onmessage = (event: MessageEvent<any>) => {
      const message = JSON.parse(event.data);
      if (message.type === "new-card") {
        const flashcard: Flashcard = message.card;
        ctx.update(ctx.flashcards, flashcard, AnswerDifficulty.Easy); // Updates the flashcards context with the new card

        console.log("New Card received", flashcard);
      }
    };

    // Logs WebSocket errors
    ws.onerror = (error) => console.error("WebSocket error:", error);

    // Closes the WebSocket connection when the component unmounts
    return () => ws.close();
  }, []);

  // Renders different UI elements based on the state of the flashcards and answer visibility
  return currentCardsCount === 0 ? (
    // If no cards are left, show a button to proceed to the next day
    <Button
      className="go-to-next-day"
      text="Go to Next Day"
      onClick={() => setDay((prev) => prev + 1)}
    />
  ) 
   : (
    // If the answer is not being shown, display buttons for getting a hint or showing the answer
    <div style={{ display: "flex", gap: "20px" }}>
      <Button
        className="get-hint"
        text="Get Hint"
        onClick={() => globalThis.alert(currentCard.current[0].hint)} // Displays a hint for the current flashcard
      />
      <Button
        className="show-answer"
        text="Show Answer"
        onClick={() => setShowAnswer((prev) => !prev)} // Toggles the answer visibility
      />
    </div>
  );
}