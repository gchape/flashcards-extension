// Flashcard class: simple Q&A card with optional hint and tags.
export class Flashcard {
  readonly id: string;
  readonly front: string;
  readonly back: string;
  readonly hint?: string;
  readonly tags: ReadonlyArray<string>;

  constructor(front: string, back: string, hint?: string, tags: ReadonlyArray<string> = []) {
    this.id = crypto.randomUUID();
    this.front = front.trim();
    this.back = back.trim();
    this.hint = hint?.trim();
    this.tags = tags;
    this.validate();
  }

  // Checks that front/back exist and tags are valid.
  private validate(): void {
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
    
    for (const t of this.tags) {
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

// User's answer rating after a flashcard.
export enum AnswerDifficulty {
  Wrong = 0,
  Hard = 1,
  Easy = 2,
}

// Map of buckets for spaced repetition (0 = new cards).
export type BucketMap = Map<number, Set<Flashcard>>;
