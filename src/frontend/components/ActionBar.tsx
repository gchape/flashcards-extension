import { useEffect } from "react";
import { Flashcard } from "../../logic/flashcards";
import Button from "./Button";
import Footer from "./Footer";

type ActionBarProps = {
  showAnswer: boolean;
  currentCardsCount: number;
  setDay: React.Dispatch<React.SetStateAction<number>>;
  currentCard: React.RefObject<Record<number, Flashcard>>;
  setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ActionBar({
  setDay,
  showAnswer,
  currentCard,
  setShowAnswer,
  currentCardsCount,
}: ActionBarProps) {
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => console.log("WebSocket connection established");

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "new-card") {
        const newCard: Flashcard = message.card;
        
        console.log("New Card received", newCard);
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);

    return () => ws.close();
  }, []);

  return currentCardsCount === 0 ? (
    <Button
      className="go-to-next-day"
      text="Go to Next Day"
      onClick={() => setDay((prev) => prev + 1)}
    />
  ) : showAnswer ? (
    <Footer>
      <Button className="wrong" text="Wrong" />
      <Button className="hard" text="Hard" />
      <Button className="easy" text="Easy" />
    </Footer>
  ) : (
    <div style={{ display: "flex", gap: "20px" }}>
      <Button
        className="get-hint"
        text="Get Hint"
        onClick={() => globalThis.alert(currentCard.current[0].hint)}
      />
      <Button
        className="show-answer"
        text="Show Answer"
        onClick={() => setShowAnswer((prev) => !prev)}
      />
    </div>
  );
}
