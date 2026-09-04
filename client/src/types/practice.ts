export type PracticeTarget = "turkish" | "slovak";

export interface PracticeWord {
  id: string;
  english: string;
  answer: string;
}

export interface PracticeSession {
  target: PracticeTarget;
  words: PracticeWord[];
}

export interface GetPracticeWordsParams {
  target: PracticeTarget;
  limit?: number;
}
