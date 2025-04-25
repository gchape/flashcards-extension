// Flashcard class: simple Q&A card with optional hint and tags.
export class Flashcard {
  readonly id: string;
  readonly front: string;
  readonly back: string;
  readonly hint?: string;
  readonly tags: ReadonlyArray<string>;

  constructor(frontSide: string, backSide: string, hintText?: string, tagList: ReadonlyArray<string> = []) {
    this.id = crypto.randomUUID();
    this.front = frontSide.trim();
    this.back = backSide.trim();
    this.hint = hintText?.trim();
    this.tags = tagList;
    this._validateFlashcard();
  }

  // Checks that front/back exist and tags are valid.
  private _validateFlashcard(): void {
    if (!this.front) {
      throw new Error("front side cannot be empty.");
    }
    if (!this.back) {
      throw new Error("back side must have an answer.");
    }
    if (this.hint !== undefined && this.hint.length === 0) {
      throw new Error("hint must not be empty.");
    }
    if (!Array.isArray(this.tags)) {
      throw new Error("tags must be an array.");
    }
    for (let t of this.tags) {
      if (typeof t !== "string" || t.trim() === "") {
        throw new Error("tags must be non-empty strings.");
      }
    }
  }
}

/*
AF:
- Flashcard = front (question), back (answer), optional hint and tags.

RI:
- front and back must not be empty.
- tags must be an array of non-empty strings.
- id is unique per card.
*/

// Creates a Flashcard instance with basic validation.
export function createFlashcard(
  front: string,
  back: string,
  hint?: string,
  tags: string[] = []
): Flashcard {
  return new Flashcard(front, back, hint, tags);
}

// Adds a Flashcard to Bucket 0 (creates it if missing).
export function addCardToBucket(bucketMap: BucketMap, card: Flashcard): void {
  if (!bucketMap.has(0)) {
    bucketMap.set(0, new Set<Flashcard>());
  }

  const bucketZero = bucketMap.get(0)!;

  if (bucketZero.has(card)) {
    throw new Error("card already exists in Bucket 0.");
  }

  bucketZero.add(card);
}

// --- Types for working with Flashcards ---

// User's answer rating after a flashcard.
export enum AnswerDifficulty {
  Wrong = 0,
  Hard = 1,
  Easy = 2,
}

// Map of buckets for spaced repetition (0 = new cards).
export type BucketMap = Map<number, Set<Flashcard>>;
