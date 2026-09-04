import { apiClient } from "./api-client";
import type { ApiResponse } from "../types/auth";
import type { CreateWordInput, UpdateWordInput, Word } from "../types/word";

export const createWordRequest = async (
  input: CreateWordInput,
): Promise<Word> => {
  const response = await apiClient.post<ApiResponse<{ word: Word }>>(
    "/words",
    input,
  );

  return response.data.data.word;
};

export const listWordsRequest = async (
  signal?: AbortSignal,
): Promise<Word[]> => {
  const response = await apiClient.get<ApiResponse<{ words: Word[] }>>(
    "/words",
    {
      signal,
    },
  );

  return response.data.data.words;
};

export const getWordRequest = async (
  wordId: string,
  signal?: AbortSignal,
): Promise<Word> => {
  const response = await apiClient.get<ApiResponse<{ word: Word }>>(
    `/words/${encodeURIComponent(wordId)}`,
    {
      signal,
    },
  );

  return response.data.data.word;
};

export const updateWordRequest = async (
  wordId: string,
  input: UpdateWordInput,
): Promise<Word> => {
  const response = await apiClient.patch<ApiResponse<{ word: Word }>>(
    `/words/${encodeURIComponent(wordId)}`,
    input,
  );

  return response.data.data.word;
};

export const deleteWordRequest = async (wordId: string): Promise<void> => {
  await apiClient.delete(`/words/${encodeURIComponent(wordId)}`);
};
