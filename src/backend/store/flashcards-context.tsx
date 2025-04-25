import { createContext, ReactNode, useContext } from "react";
import { update } from "../../logic/algorithm";
import { FlashcardsContext } from "./types";
import { BucketMap, Flashcard } from "../../logic/flashcards";

const Context = createContext<FlashcardsContext | null>(null);

function initialState(): BucketMap {
  const flashcards = new Map<number, Set<Flashcard>>();

  const initialCards = [
    new Flashcard("What is the capital of France?", "Paris", "It's known as the city of light"),
    new Flashcard("Who wrote '1984'?", "George Orwell", "A famous dystopian novel"),
    new Flashcard("What is the boiling point of water (in Celsius)?", "100", "Standard pressure"),
  ];

  flashcards.set(0, new Set(initialCards));

  return flashcards;
}

export default function FlashcardsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const flashcardsContext: FlashcardsContext = {
    flashcards: initialState(),
    update: update,
  };

  return (
    <Context.Provider value={flashcardsContext}>{children}</Context.Provider>
  );
}

export function useFlashcardsContext() {
  const flashcardsContext = useContext(Context);

  if (flashcardsContext === null) {
    throw new Error("Context must be used within a FlashcardsContextProvider");
  }

  return flashcardsContext;
}
