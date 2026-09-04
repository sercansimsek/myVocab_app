import { apiClient } from "./api-client";
import type { ApiResponse } from "../types/auth";
import type { CreateWordInput, Word } from "../types/word";

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
