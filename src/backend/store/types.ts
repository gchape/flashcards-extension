import { AnswerDifficulty, BucketMap, Flashcard } from "../../logic/flashcards";

export type FlashcardsState = {
  flashcards: BucketMap;
};

type FlashcardsApi = {
  update: (
    buckets: BucketMap,
    card: Flashcard,
    difficulty: AnswerDifficulty
  ) => BucketMap;

  practice: (day: number, buckets: Set<Flashcard>[]) => Set<Flashcard>;
};

export type FlashcardsContext = FlashcardsState & FlashcardsApi;
