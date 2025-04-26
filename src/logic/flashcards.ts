// Flashcard class: It is a simple Q&A card with optional hints and tags.
// (Might tweak this later if we want categories or difficulty levels...)

export class Flashcard {
  readonly id: string;
  readonly front: string;
  readonly back: string;
  readonly hint?: string;
  readonly tags: ReadonlyArray<string>;

  constructor(frontSide: string, backSide: string, hintText?: string, tagList: ReadonlyArray<string> = []) {
    // Assign a random ID (hope crypto is supported everywhere...)
    this.id = crypto.randomUUID();

    this.front = frontSide.trim();
    this.back = backSide.trim();
    this.hint = hintText?.trim(); // Its fine if no hint is passed
    this.tags = tagList;

    this._validateFlashcard(); // sanity check - make sure its not totally broken
  }

  //internal check to make sure the card isn't missing required stuff
  private _validateFlashcard(): void {
    if (!this.front) {
      throw new Error("Front side cannot be empty. Otherwise, what's the question?");
    }
    if (!this.back) {
      throw new Error("Back side must have an answer. (duh)");
    }
    if (this.hint !== undefined && this.hint.length === 0) {
      throw new Error("If you give hint, it should actually hint something.");
    }

    if (!Array.isArray(this.tags)) {
      throw new Error("Tags should be list.Even if it's empty.");
    }

    // little paranoid loop just to make sure tags make sense
    for (let t of this.tags) {
      if (typeof t !== "string" || t.trim() === "") {
        throw new Error("Every tag need to be non-empty string. No ghost tags.");
      }
    }
  }
}

/*
Abstraction Function (AF):
- Think of a Flashcard like a study helper: front = question, back = answer, plus maybe a hint or some tags to keep organized.

Representation Invariant (RI):
- front and back must have actual text.
- hint must be meaningful if it exists.
- tags must be a proper array of non-empty strings.
- id is assigned at creation and should stay unique.
*/

// TODO: Maybe later add createdAt timestamp?
// TODO: Support markdown in front/back? (stretch goal)




// Wrapper to create a Flashcard instance.
// Keeps things cleaner wherever we’re generating new cards (especially outside the class file).
// Feeds straight into the Flashcard constructor, which handles trimming + validation.

// Note: throws if front/back are missing or any tag/hint is off,
// so whoever’s calling this should probably catch errors if needed.
export function createFlashcard(
  front: string,
  back: string,
  hint?: string,
  tags: string[] = []
): Flashcard {
  return new Flashcard(front, back, hint, tags); // pretty much just passes through for now
}


// Drops a flashcard into Bucket 0 (initial learning bucket).
// If Bucket 0 isn’t there yet, we make it first.
//
// Note: throws if the card’s already in — we’re avoiding dupes here on purpose.
export function addCardToBucket(bucketMap: BucketMap, card: Flashcard): void {
  // Init bucket 0 if it hasn’t been created yet
  if (!bucketMap.has(0)) {
    bucketMap.set(0, new Set<Flashcard>());
  }

  const bucketZero = bucketMap.get(0)!;

  // Avoid re-adding the same card (for data consistency)
  if (bucketZero.has(card)) {
    throw new Error("Card already exists in Bucket 0."); // could switch to warn later if needed
  }

  bucketZero.add(card);
}
