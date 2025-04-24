import { createContext, ReactNode, useContext } from "react";
import { update } from "../../logic/algorithm";
import { AnswerDifficulty, BucketMap, Flashcard } from "../../logic/flashcards";

type FlashcardsState = {
  flashcards: BucketMap;
};

type FlashcardsContextValue = FlashcardsState & {
  update: (
    buckets: BucketMap,
    card: Flashcard,
    difficulty: AnswerDifficulty
  ) => BucketMap;
};

const FlashcardsContext = createContext<FlashcardsContextValue | null>(null);

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
  const ctx: FlashcardsContextValue = {
    flashcards: initialState(),
    update: update,
  };

  return (
    <FlashcardsContext.Provider value={ctx}>
      {children}
    </FlashcardsContext.Provider>
  );
}

export function useFlashcardsContext() {
  const flashcardsContext = useContext(FlashcardsContext);

  if (flashcardsContext === null) {
    throw new Error("Context must be used within a FlashcardsContextProvider");
  }

  return flashcardsContext;
}
