import { useEffect, useRef, useState } from "react";
import FlashcardsContextProvider from "../backend/store/flashcards-context";
import Main from "./components/Main";
import Header from "./components/Header";
import Card from "./components/Card";
import { ActionBar } from "./components/ActionBar";
import { Flashcard } from "../logic/flashcards";
import { startDetection, stopDetection, cleanupDetection } from "./components/detect/detection";

export default function App() {
  const [day, setDay] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCardsCount, setCurrentCardsCount] = useState(0);
  const [isDetectionActive, setIsDetectionActive] = useState(false);

  const currentCard = useRef<Record<number, Flashcard>>([]);

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      cleanupDetection();
    };
  }, []);

  const handleDetectionToggle = async () => {
    if (!isDetectionActive) {
      await startDetection();
    } else {
      stopDetection();
    }
    setIsDetectionActive(!isDetectionActive);
  };

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