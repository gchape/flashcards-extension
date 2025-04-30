import { AnswerDifficulty, Flashcard, BucketMap } from "../../logic/flashcards";

export type FlashcardsAction =
  | { type: "SET_STATE"; newState: BucketMap }
  | { type: "PRACTICE_CARDS"; day: number }; // optional, for future use

export type FlashcardsState = {
  flashcards: BucketMap;
  update: (
    buckets: BucketMap,
    card: Flashcard,
    difficulty: AnswerDifficulty
  ) => BucketMap;
  practice: (day: number, buckets: Set<Flashcard>[]) => Set<Flashcard>;
};
