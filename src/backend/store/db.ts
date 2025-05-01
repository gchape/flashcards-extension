import { Low, Memory } from "lowdb";
import { Flashcard, BucketMap } from "../../logic/flashcards";
import { DBData, SaveFlashcardProps } from "./types";
import { update } from "../../logic/algorithm";

// Adapter for the in-memory database
const adapter = new Memory<DBData>();
const db = new Low<DBData>(adapter, { cards: init() });

// Initializes the database with initial flashcards in bucket 0
function init(): BucketMap {
  const map: BucketMap = new Map();

  const initialCards = [
    new Flashcard("What is the capital of France?", "Paris", "City of Light"),
    new Flashcard("Who wrote '1984'?", "George Orwell", "Dystopian novel"),
  ];

  map.set(0, new Set(initialCards));
  return map;
}

// Retrieves the current flashcards from the in-memory DB
export async function getFlashcards(): Promise<BucketMap> {
  await db.read();

  return db.data.cards;
}

// Saves a flashcard after updating it based on user input and difficulty
export async function updateFlashcard({
  flashcard,
  difficulty,
}: SaveFlashcardProps): Promise<void> {
  const currentBuckets = await getFlashcards();
  const updatedBuckets = update(currentBuckets, flashcard, difficulty);

  await updateBuckets(updatedBuckets);
}

// Replaces the DB's bucket map with the updated one
async function updateBuckets(buckets: BucketMap): Promise<void> {
  db.data.cards! = buckets;

  await db.write();
}
