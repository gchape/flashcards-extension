import { Flashcard, createFlashcard, AnswerDifficulty } from '../flashcards';

// Mock crypto.randomUUID to ensure consistent IDs during tests
const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
global.crypto = { 
  ...global.crypto,
  randomUUID: () => mockUUID 
};

describe('Flashcard', () => {
  describe('constructor', () => {
    it('should create a valid flashcard with required fields', () => {
      const card = new Flashcard('Question', 'Answer');
      expect(card.front).toBe('Question');
      expect(card.back).toBe('Answer');
      expect(card.id).toBe(mockUUID);
      expect(card.hint).toBeUndefined();
      expect(card.tags).toEqual([]);
    });

    it('should create a flashcard with a hint', () => {
      const card = new Flashcard('Question', 'Answer', 'This is a hint');
      expect(card.hint).toBe('This is a hint');
    });

    it('should create a flashcard with tags', () => {
      const tags = ['tag1', 'tag2'];
      const card = new Flashcard('Question', 'Answer', undefined, tags);
      expect(card.tags).toEqual(tags);
    });

    it('should trim whitespace from front, back, and hint', () => {
      const card = new Flashcard('  Question  ', '  Answer  ', '  Hint  ');
      expect(card.front).toBe('Question');
      expect(card.back).toBe('Answer');
      expect(card.hint).toBe('Hint');
    });

    it('should throw error if front is empty', () => {
      expect(() => new Flashcard('', 'Answer')).toThrow('front side cannot be empty');
    });

    it('should throw error if back is empty', () => {
      expect(() => new Flashcard('Question', '')).toThrow('back side must have an answer');
    });

    it('should throw error if hint is empty string', () => {
      expect(() => new Flashcard('Question', 'Answer', '')).toThrow('hint must not be empty');
    });

    it('should throw error if tags are not an array', () => {
      // @ts-ignore - Testing runtime validation
      expect(() => new Flashcard('Question', 'Answer', undefined, 'tag')).toThrow('tags must be an array');
    });

    it('should throw error if any tag is empty', () => {
      expect(() => new Flashcard('Question', 'Answer', undefined, ['tag1', ''])).toThrow('tags must be non-empty strings');
    });
  });

  describe('createFlashcard', () => {
    it('should create a valid flashcard', () => {
      const card = createFlashcard('Question', 'Answer', 'Hint', ['tag1', 'tag2']);
      expect(card).toBeInstanceOf(Flashcard);
      expect(card.front).toBe('Question');
      expect(card.back).toBe('Answer');
      expect(card.hint).toBe('Hint');
      expect(card.tags).toEqual(['tag1', 'tag2']);
    });
  });

  describe('AnswerDifficulty', () => {
    it('should have correct enum values', () => {
      expect(AnswerDifficulty.Wrong).toBe(0);
      expect(AnswerDifficulty.Hard).toBe(1);
      expect(AnswerDifficulty.Easy).toBe(2);
    });
  });
});