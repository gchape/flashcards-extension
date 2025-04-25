import { createContext, ReactNode, useContext } from "react";
import { update } from "../../logic/algorithm";
import { FlashcardsContext } from "./types";
import { BucketMap, Flashcard } from "../../logic/flashcards";

const Context = createContext<FlashcardsContext | null>(null);

function initialState(): BucketMap {
  const flashcards = new Map<number, Set<Flashcard>>();

  // TODO (add initial cards)

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
