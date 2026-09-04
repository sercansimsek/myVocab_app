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
