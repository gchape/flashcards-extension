import { useRef, useState } from "react";
import Main from "./components/Main";
import Header from "./components/Header";
import Card from "./components/Card";
import { ActionBar } from "./components/ActionBar";
import { Flashcard } from "../logic/flashcards";

export default function App() {
  const [day, setDay] = useState(0);
  const [cardsLeft, setCardsLeft] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentCard = useRef<Record<number, Flashcard>>([]);

  return (
    <Main>
      <Header day={day} />
      <Card
        day={day}
        showAnswer={showAnswer}
        currentCard={currentCard}
        setCardsLeft={setCardsLeft}
        setShowAnswer={setShowAnswer}
      />
      <ActionBar
        setDay={setDay}
        cardsLeft={cardsLeft}
        showAnswer={showAnswer}
        currentCard={currentCard}
        setShowAnswer={setShowAnswer}
      />
    </Main>
  );
}
