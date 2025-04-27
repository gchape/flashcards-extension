import { toBucketsSets, practice, update, getHint, computeProgress } from '../algorithm';
import { Flashcard, AnswerDifficulty } from '../flashcards';

// Mock crypto.randomUUID for consistent tests
const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
global.crypto = { 
  ...global.crypto,
  randomUUID: () => mockUUID 
};

describe('Flashcard Algorithm', () => {
  let card1: Flashcard, card2: Flashcard, card3: Flashcard;
  
  beforeEach(() => {
    card1 = new Flashcard('Question 1', 'Answer 1', 'Hint 1');
    card2 = new Flashcard('Question 2', 'Answer 2');
    card3 = new Flashcard('Question 3', 'Answer 3', 'Hint 3');
  });

  describe('toBucketsSets', () => {
    it('should convert buckets map to array of sets', () => {
      const bucketMap = new Map<number, Set<Flashcard>>();
      bucketMap.set(0, new Set([card1]));
      bucketMap.set(2, new Set([card2, card3]));

      const result = toBucketsSets(bucketMap);
      
      expect(result[0]).toEqual(new Set([card1]));
      expect(result[1]).toBeUndefined();
      expect(result[2]).toEqual(new Set([card2, card3]));
    });

    it('should throw error if bucket index is negative', () => {
      const bucketMap = new Map<number, Set<Flashcard>>();
      bucketMap.set(-1, new Set([card1]));

      expect(() => toBucketsSets(bucketMap)).toThrow('Bucket index, must be a nonnegative number');
    });
  });

  describe('practice', () => {
    it('should throw error if day is less than 1', () => {
      const buckets: Set<Flashcard>[] = [new Set([card1])];
      
      expect(() => practice(0, buckets)).toThrow('Day of the learning process, must be >= 1');
    });

    it('should always include cards from bucket 0', () => {
      const buckets: Set<Flashcard>[] = [
        new Set([card1]),
        new Set([card2]),
        new Set([card3])
      ];
      
      const result = practice(1, buckets);
      expect(result.has(card1)).toBe(true);
    });

    it('should include cards from bucket 1 when day is divisible by 2', () => {
      const buckets: Set<Flashcard>[] = [
        new Set([card1]),
        new Set([card2]),
        new Set([card3])
      ];
      
      const day2Result = practice(2, buckets);
      expect(day2Result.has(card1)).toBe(true);
      expect(day2Result.has(card2)).toBe(true);
      
      const day3Result = practice(3, buckets);
      expect(day3Result.has(card1)).toBe(true);
      expect(day3Result.has(card2)).toBe(false);
    });

    it('should include cards from bucket 2 when day is divisible by 4', () => {
      const buckets: Set<Flashcard>[] = [
        new Set([card1]),
        new Set([card2]),
        new Set([card3])
      ];
      
      const day4Result = practice(4, buckets);
      expect(day4Result.has(card1)).toBe(true);
      expect(day4Result.has(card2)).toBe(true);
      expect(day4Result.has(card3)).toBe(true);
      
      const day3Result = practice(3, buckets);
      expect(day3Result.has(card3)).toBe(false);
    });

    it('should handle empty buckets gracefully', () => {
      const buckets: Set<Flashcard>[] = [];
      
      const result = practice(1, buckets);
      expect(result.size).toBe(0);
    });
  });

  describe('getHint', () => {
    it('should return hint when available', () => {
      expect(getHint(card1)).toBe('Hint 1');
    });

    it('should throw error when no hint available', () => {
      expect(() => getHint(card2)).toThrow('No hint available for this card');
    });
  });

  describe('update', () => {
    it('should move card to bucket 0 when difficulty is Wrong', () => {
      const buckets = new Map<number, Set<Flashcard>>();
      buckets.set(2, new Set([card1]));
      
      const result = update(buckets, card1, AnswerDifficulty.Wrong);
      
      expect(result.get(0)?.has(card1)).toBe(true);
      expect(result.get(2)?.has(card1)).toBe(false);
    });

    it('should keep card in same bucket when difficulty is Hard', () => {
      const buckets = new Map<number, Set<Flashcard>>();
      buckets.set(2, new Set([card1]));
      
      const result = update(buckets, card1, AnswerDifficulty.Hard);
      
      expect(result.get(2)?.has(card1)).toBe(true);
    });

    it('should move card to next bucket when difficulty is Easy', () => {
      const buckets = new Map<number, Set<Flashcard>>();
      buckets.set(2, new Set([card1]));
      
      const result = update(buckets, card1, AnswerDifficulty.Easy);
      
      expect(result.get(3)?.has(card1)).toBe(true);
      expect(result.get(2)?.has(card1)).toBe(false);
    });

    it('should handle card not found in any bucket', () => {
      const buckets = new Map<number, Set<Flashcard>>();
      buckets.set(0, new Set([card2]));
      
      const result = update(buckets, card1, AnswerDifficulty.Easy);
      
      expect(result.get(0)?.has(card2)).toBe(true);
      expect(result.get(1)?.has(card1)).toBe(true);
    });
  });

  describe('computeProgress', () => {
    it('should calculate correct stats', () => {
      const buckets = new Map<number, Set<Flashcard>>();
      buckets.set(0, new Set([card1]));
      buckets.set(2, new Set([card2]));
      buckets.set(3, new Set([card3]));
      
      const history = [
        { card: card1, timestamp: 1000, difficulty: AnswerDifficulty.Wrong },
        { card: card2, timestamp: 2000, difficulty: AnswerDifficulty.Hard },
        { card: card3, timestamp: 3000, difficulty: AnswerDifficulty.Easy },
      ];
      
      const result = computeProgress(buckets, history);
      
      expect(result.totalCards).toBe(3);
      expect(result.cardsPerBucket.get(0)).toBe(1);
      expect(result.cardsPerBucket.get(2)).toBe(1);
      expect(result.cardsPerBucket.get(3)).toBe(1);
      expect(result.averageBucket).toBe((0*1 + 2*1 + 3*1) / 3);
      expect(result.masteredCards).toBe(1);
      expect(result.successRate).toBe((2/3) * 100);
    });

    it('should handle empty buckets', () => {
      const buckets = new Map<number, Set<Flashcard>>();
      const history: Array<{card: Flashcard, timestamp: number, difficulty: AnswerDifficulty}> = [];
      
      const result = computeProgress(buckets, history);
      
      expect(result.totalCards).toBe(0);
      expect(result.averageBucket).toBe(0);
      expect(result.masteredCards).toBe(0);
      expect(result.successRate).toBe(0);
    });
  });
});