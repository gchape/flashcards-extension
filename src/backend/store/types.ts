import { AnswerDifficulty, BucketMap, Flashcard } from "../../logic/flashcards";

// Type representing the database structure
export type DBData = {
  cards: BucketMap;
};

// Type for the properties passed to the `saveFlashcard` function
export type SaveFlashcardProps = {
  flashcard: Flashcard;
  difficulty: AnswerDifficulty;
};
