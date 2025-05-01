import { useRef, useState } from "react";
import Main from "./components/Main";
import Header from "./components/Header";
import Card from "./components/Card";
import { ActionBar } from "./components/ActionBar";
import { Flashcard } from "../logic/flashcards";

export default function App() {
  const [day, setDay] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCardsCount, setCurrentCardsCount] = useState(0);

  const currentCard = useRef<Record<number, Flashcard>>([]);

  return (
    <Main>
      <Header day={day} />
      <Card
        day={day}
        showAnswer={showAnswer}
        currentCard={currentCard}
        setShowAnswer={setShowAnswer}
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
  );
}
