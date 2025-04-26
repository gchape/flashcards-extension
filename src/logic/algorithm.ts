import { AnswerDifficulty, BucketMap, Flashcard } from "./flashcards";

// Selects flashcards to practice today based on the day.
// - Always practice Bucket 0 (new/wrong)
// - Higher buckets shown every 2^bucketNumber days
export function practice(day: number, bucketMap: BucketMap): Set<Flashcard> {
  if (day < 1) {
    throw new Error("Day must be >= 1.");
  }

  const cardsToPractice = new Set<Flashcard>();

  for (const [bucketNumber, flashcards] of bucketMap.entries()) {
    if (bucketNumber === 0) {
      for (const card of flashcards) {
        cardsToPractice.add(card);
      }
    } else {
      const interval = Math.pow(2, bucketNumber);
      if (day % interval === 0) {
        for (const card of flashcards) {
          cardsToPractice.add(card);
        }
      }
    }
  }

  return cardsToPractice;
}

// Updates a flashcard's bucket based on answer difficulty.
// - Wrong ➔ Bucket 0
// - Hard ➔ Stay in same bucket
// - Easy ➔ Move to next higher bucket
export function update(
  bucketMap: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {
  const newBuckets = new Map<number, Set<Flashcard>>();
  let currentBucketNumber: number | null = null;

  for (const [bucketNumber, cards] of bucketMap.entries()) {
    const copiedCards = new Set<Flashcard>(cards);
    newBuckets.set(bucketNumber, copiedCards);

    if (cards.has(card)) {
      currentBucketNumber = bucketNumber;
    }
  }

  if (currentBucketNumber === null) {
    throw new Error("Card not found in any bucket.");
  }

  newBuckets.get(currentBucketNumber)!.delete(card);

  let targetBucketNumber: number;
  if (difficulty === AnswerDifficulty.Wrong) {
    targetBucketNumber = 0;
  } else if (difficulty === AnswerDifficulty.Hard) {
    targetBucketNumber = currentBucketNumber;
  } else {
    targetBucketNumber = currentBucketNumber + 1;
  }

  if (!newBuckets.has(targetBucketNumber)) {
    newBuckets.set(targetBucketNumber, new Set<Flashcard>());
  }

  newBuckets.get(targetBucketNumber)!.add(card);

  return newBuckets;
}
