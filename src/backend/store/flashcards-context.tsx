import { createContext, ReactNode, useContext, useReducer } from "react";
import { practice, update } from "../../logic/algorithm";
import { FlashcardsAction, FlashcardsState } from "./types";
import { BucketMap, Flashcard } from "../../logic/flashcards";

// Create initial state with some sample flashcards in bucket 0
function initialState(): BucketMap {
  const flashcards = new Map<number, Set<Flashcard>>();
  const initialCards = [
    new Flashcard(
      "What is the capital of France?",
      "Paris",
      "It's known as the city of light"
    ),
    new Flashcard(
      "Who wrote '1984'?",
      "George Orwell",
      "A famous dystopian novel"
    ),
  ];
  flashcards.set(0, new Set(initialCards));
  return flashcards;
}

// Reducer
function flashcardsReducer(
  state: BucketMap,
  action: FlashcardsAction
): BucketMap {
  switch (action.type) {
    case "SET_STATE":
      return action.newState;
    default:
      return state;
  }
}

// Context
const Context = createContext<FlashcardsState | null>(null);

// Provider
export default function FlashcardsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [flashcards, dispatch] = useReducer(flashcardsReducer, initialState());

  const flashcardsContext: FlashcardsState = {
    flashcards,
    update: (buckets, card, difficulty) => {
      const newState = update(buckets, card, difficulty);
      dispatch({ type: "SET_STATE", newState });
      return newState;
    },
    practice: (day, buckets) => practice(day, buckets),
  };

  return (
    <Context.Provider value={flashcardsContext}>{children}</Context.Provider>
  );
}

// Hook to access context
export function useFlashcardsContext() {
  const flashcardsContext = useContext(Context);
  if (!flashcardsContext) {
    throw new Error("Context must be used within a FlashcardsContextProvider!");
  }
  return flashcardsContext;
}
