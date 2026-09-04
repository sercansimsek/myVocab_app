export interface Word {
  id: string;
  english: string;
  turkish: string;
  slovak: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWordInput {
  english: string;
  turkish: string;
  slovak: string;
  notes?: string;
}

export interface UpdateWordInput {
  english?: string;
  turkish?: string;
  slovak?: string;
  notes?: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface WordListResult {
  words: Word[];
  pagination: Pagination;
}

export interface ListWordsParams {
  search?: string;
  page?: number;
  limit?: number;
}
