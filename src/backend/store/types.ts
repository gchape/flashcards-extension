import { AnswerDifficulty, BucketMap, Flashcard } from "../../logic/flashcards";

export type FlashcardsState = {
  flashcards: BucketMap;
};

type FlashcardsAPI = {
  update: (
    buckets: BucketMap,
    card: Flashcard,
    difficulty: AnswerDifficulty
  ) => BucketMap;
};

export type FlashcardsContext = FlashcardsState & FlashcardsAPI;
