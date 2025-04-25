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
