import { AnswerDifficulty, BucketMap, Flashcard } from "./flashcards";

// Selects flashcards to practice today based on the day.
// - Always practice Bucket 0 (new/wrong)
// - Higher buckets shown every 2^bucketNumber days
export function practice(day: number, bucketMap: BucketMap): Set<Flashcard> {
  if (day < 1) {
    throw new Error("day must be >= 1.");
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
    throw new Error("card not found in any bucket.");
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


// Builds a hint from the flashcard if none exists
export function getHint(card: Flashcard): string {
  if (card.hint && card.hint.trim() !== "") {
    return card.hint;
  }

  const answerWords = card.back.split(/\s+/);

  const maskedWords = answerWords.map((word) => {
    if (word.length === 0) return "";
    return word[0] + "_".repeat(word.length - 1);
  });

  return maskedWords.join(" ");
}

// Computes basic progress stats based on buckets and practice history
export function computeProgress(
  buckets: BucketMap,
  history: Array<{
    card: Flashcard;
    timestamp: number;
    difficulty: AnswerDifficulty;
  }>
): {
  totalCards: number;
  cardsPerBucket: Map<number, number>;
  averageBucket: number;
  masteredCards: number;
  successRate: number;
} {
  let totalCards = 0;
  const cardsPerBucket = new Map<number, number>();

  for (const [bucket, cards] of buckets.entries()) {
    const count = cards.size;
    totalCards += count;
    cardsPerBucket.set(bucket, count);
  }

  let bucketSum = 0;
  for (const [bucket, count] of cardsPerBucket.entries()) {
    bucketSum += bucket * count;
  }

  const averageBucket = totalCards > 0 ? bucketSum / totalCards : 0;

  let masteredCards = 0;
  for (const [bucket, count] of cardsPerBucket.entries()) {
    if (bucket >= 3) {
      masteredCards += count;
    }
  }

  let successCount = 0;
  for (const entry of history) {
    if (entry.difficulty !== AnswerDifficulty.Wrong) {
      successCount++;
    }
  }

  const successRate = history.length > 0 ? (successCount / history.length) * 100 : 0;

  return {
    totalCards,
    cardsPerBucket,
    averageBucket,
    masteredCards,
    successRate,
  };
}
