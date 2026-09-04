import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "../api/api-error";
import { getPracticeWordsRequest } from "../api/practice-api";
import type { PracticeSession, PracticeTarget } from "../types/practice";

const getTargetLabel = (target: PracticeTarget): string =>
  target === "turkish" ? "Turkish" : "Slovak";

const normalizeAnswer = (answer: string, target: PracticeTarget): string => {
  const locale = target === "turkish" ? "tr-TR" : "sk-SK";

  return answer.trim().normalize("NFC").toLocaleLowerCase(locale);
};

export const PracticePage = () => {
  const [target, setTarget] = useState<PracticeTarget>("turkish");
  const [limit, setLimit] = useState(10);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState("");
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [answerErrorMessage, setAnswerErrorMessage] = useState("");

  const currentWord = session?.words[currentIndex];

  const resetQuestion = () => {
    setAnswerInput("");
    setIsAnswerRevealed(false);
    setIsCorrect(null);
    setAnswerErrorMessage("");
  };

  const handleStart = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const result = await getPracticeWordsRequest({
        target,
        limit,
      });

      if (result.words.length === 0) {
        setSession(null);
        setErrorMessage(
          "You need to add at least one word before starting practice.",
        );

        return;
      }

      setSession(result);
      setCurrentIndex(0);
      setCorrectCount(0);
      setIsComplete(false);
      resetQuestion();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to start practice"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session || !currentWord || isAnswerRevealed) {
      return;
    }

    if (!answerInput.trim()) {
      setAnswerErrorMessage("Enter an answer before checking it.");

      return;
    }

    setAnswerErrorMessage("");

    const answerIsCorrect =
      normalizeAnswer(answerInput, session.target) ===
      normalizeAnswer(currentWord.answer, session.target);

    setIsCorrect(answerIsCorrect);
    setIsAnswerRevealed(true);

    if (answerIsCorrect) {
      setCorrectCount((currentCount) => currentCount + 1);
    }
  };

  const handleRevealAnswer = () => {
    setAnswerErrorMessage("");
    setIsCorrect(false);
    setIsAnswerRevealed(true);
  };

  const handleAdvance = () => {
    if (!session) {
      return;
    }

    if (currentIndex >= session.words.length - 1) {
      setIsComplete(true);

      return;
    }

    setCurrentIndex((index) => index + 1);
    resetQuestion();
  };

  const handleChooseAnotherMode = () => {
    setSession(null);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsComplete(false);
    setErrorMessage("");
    resetQuestion();
  };

  if (session && isComplete) {
    const percentage = Math.round((correctCount / session.words.length) * 100);

    return (
      <section>
        <h1>Practice Complete</h1>

        <p>
          You answered {correctCount} of {session.words.length} correctly.
        </p>
        <p>Score: {percentage}%</p>

        <button type="button" onClick={handleChooseAnotherMode}>
          Start another session
        </button>

        <p>
          <Link to="/">Back to dashboard</Link>
        </p>
      </section>
    );
  }

  if (session && currentWord) {
    return (
      <section>
        <Link to="/">End practice and return to dashboard</Link>

        <h1>Practice</h1>

        <p>English → {getTargetLabel(session.target)}</p>
        <p>
          Word {currentIndex + 1} of {session.words.length}
        </p>

        <article>
          <h2>{currentWord.english}</h2>

          <form onSubmit={handleCheckAnswer}>
            <label htmlFor="practice-answer">Your answer</label>
            <input
              id="practice-answer"
              type="text"
              value={answerInput}
              onChange={(event) => setAnswerInput(event.target.value)}
              disabled={isAnswerRevealed}
              autoComplete="off"
              autoFocus
            />

            {answerErrorMessage && <p role="alert">{answerErrorMessage}</p>}

            {!isAnswerRevealed && <button type="submit">Check answer</button>}
          </form>

          {isAnswerRevealed && (
            <div aria-live="polite">
              <p>
                {isCorrect
                  ? "Correct!"
                  : "Not quite. Review the correct answer."}
              </p>
              <p>
                Correct answer: <strong>{currentWord.answer}</strong>
              </p>
            </div>
          )}

          <div>
            {isAnswerRevealed ? (
              <button type="button" onClick={handleAdvance}>
                {currentIndex === session.words.length - 1
                  ? "See results"
                  : "Next word"}
              </button>
            ) : (
              <>
                <button type="button" onClick={handleRevealAnswer}>
                  Reveal answer
                </button>
                <button type="button" onClick={handleAdvance}>
                  Skip word
                </button>
              </>
            )}
          </div>
        </article>
      </section>
    );
  }

  return (
    <section>
      <Link to="/">Back to dashboard</Link>

      <h1>Start Practice</h1>
      <p>Choose which translation you want to practise.</p>

      {errorMessage && <p role="alert">{errorMessage}</p>}

      <form onSubmit={handleStart}>
        <div>
          <label htmlFor="practice-target">Target language</label>
          <select
            id="practice-target"
            value={target}
            onChange={(event) =>
              setTarget(event.target.value as PracticeTarget)
            }
          >
            <option value="turkish">English → Turkish</option>
            <option value="slovak">English → Slovak</option>
          </select>
        </div>

        <div>
          <label htmlFor="practice-limit">Maximum words</label>
          <select
            id="practice-limit"
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value))}
          >
            <option value={10}>10 words</option>
            <option value={15}>15 words</option>
            <option value={20}>20 words</option>
          </select>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Preparing..." : "Start Practice"}
        </button>
      </form>
    </section>
  );
};
