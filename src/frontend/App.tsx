import { useState } from "react";
import FlashcardsContextProvider from "../backend/store/flashcards-context";
import Main from "./components/Main";
import Header from "./components/Header";
import Card from "./components/Card";
import { ActionBar } from "./components/ActionBar";

export default function App() {
  const [day, setDay] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCardsCount, setCurrentCardsCount] = useState(0);

  return (
    <FlashcardsContextProvider>
      <Main>
        <Header day={day} />
        <Card
          day={day}
          showAnswer={showAnswer}
          setCurrentCardsCount={setCurrentCardsCount}
        />
        <ActionBar
          setDay={setDay}
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer}
          currentCardsCount={currentCardsCount}
        />
      </Main>
    </FlashcardsContextProvider>
  );
}
