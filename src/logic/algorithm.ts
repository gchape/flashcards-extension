import { AnswerDifficulty, BucketMap, Flashcard } from "./flashcards";

export function toBucketsSets(bucketNumbers: BucketMap) {
  const result: Set<Flashcard>[] = [];

  for (const [bucketNum, cards] of bucketNumbers.entries()) {
    if (bucketNum < 0) {
      throw new Error("Bucket index, must be a nonnegative number.");
    }

    result[bucketNum] = cards;
  }

  return result;
}

// Selects flashcards to practice today based on the day.
// - Always practice Bucket 0 (new/wrong)
// - Higher buckets shown every 2^bucketNumber days
export function practice(
  day: number,
  buckets: Set<Flashcard>[]
): Set<Flashcard> {
  if (day < 1) {
    throw new Error("Day of the learning process, must be >= 1.");
  }

  const result = new Set<Flashcard>();

  if (buckets[0]) {
    for (const card of buckets[0]) {
      result.add(card);
    }
  }

  for (let bucketNum = 1; bucketNum < buckets.length; bucketNum++) {
    const interval = Math.pow(2, bucketNum);
    if (day % interval === 0 && buckets[bucketNum]) {
      for (const card of buckets[bucketNum]) {
        result.add(card);
      }
    }
  }

  return result;
}

export function getHint(card: Flashcard): string {
  if (card.hint) {
    return card.hint;
  }

  throw new Error("No hint available for this card.");
}

// Updates a flashcard's bucket based on answer difficulty.
// - Wrong ➔ Bucket 0
// - Hard ➔ Stay in same bucket
// - Easy ➔ Move to next higher bucket
export function update(
  buckets: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {
  const newBuckets = new Map<number, Set<Flashcard>>();

  let currentBucket = -1;
  for (const [bucketNum, cards] of buckets.entries()) {
    const newSet = new Set<Flashcard>(cards);
    newBuckets.set(bucketNum, newSet);

    if (cards.has(card)) {
      currentBucket = bucketNum;
    }
  }

  if (currentBucket === -1 && !newBuckets.has(0)) {
    newBuckets.set(0, new Set<Flashcard>());
  } else if (currentBucket !== -1) {
    const currentSet = newBuckets.get(currentBucket)!;
    currentSet.delete(card);
  }

  let newBucket: number;
  if (difficulty === AnswerDifficulty.Wrong) {
    newBucket = 0;
  } else if (difficulty === AnswerDifficulty.Hard) {
    newBucket = currentBucket;
  } else {
    newBucket = currentBucket + 1;
  }

  if (!newBuckets.has(newBucket)) {
    newBuckets.set(newBucket, new Set<Flashcard>());
  }
  newBuckets.get(newBucket)!.add(card);

  return newBuckets;
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

  const successRate =
    history.length > 0 ? (successCount / history.length) * 100 : 0;

  return {
    totalCards,
    cardsPerBucket,
    averageBucket,
    masteredCards,
    successRate,
  };
}
