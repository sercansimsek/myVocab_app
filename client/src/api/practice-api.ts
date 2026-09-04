import { apiClient } from "./api-client";
import type { ApiResponse } from "../types/auth";
import type {
  GetPracticeWordsParams,
  PracticeSession,
} from "../types/practice";

export const getPracticeWordsRequest = async (
  params: GetPracticeWordsParams,
  signal?: AbortSignal,
): Promise<PracticeSession> => {
  const response = await apiClient.get<ApiResponse<PracticeSession>>(
    "/practice/words",
    {
      params,
      signal,
    },
  );

  return response.data.data;
};
