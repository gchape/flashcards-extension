import { useEffect, useRef, useState } from "react";
import FlashcardsContextProvider from "../backend/store/flashcards-context";
import Main from "./components/Main";
import Header from "./components/Header";
import Card from "./components/Card";
import { ActionBar } from "./components/ActionBar";
import { Flashcard } from "../logic/flashcards";
import { startDetection } from "../detect/detection";

export default function App() {
  const [day, setDay] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCardsCount, setCurrentCardsCount] = useState(0);

  const currentCard = useRef<Record<number, Flashcard>>([]);

  useEffect(() => {
    if (showAnswer) {
      startDetection();
    }
  }, [showAnswer]);

  return (
    <FlashcardsContextProvider>
      <Main>
        <Header day={day} />
        <Card
          day={day}
          showAnswer={showAnswer}
          currentCard={currentCard}
          setCurrentCardsCount={setCurrentCardsCount}
        />
        <ActionBar
          setDay={setDay}
          showAnswer={showAnswer}
          currentCard={currentCard}
          setShowAnswer={setShowAnswer}
          currentCardsCount={currentCardsCount}
        />
      </Main>
    </FlashcardsContextProvider>
  );
}
