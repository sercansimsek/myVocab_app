import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../api/api-error";
import { deleteWordRequest, listWordsRequest } from "../api/word-api";
import { useAuth } from "../auth/use-auth";
import type { Word } from "../types/word";

const WordList = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingWordId, setDeletingWordId] = useState<string | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadWords = async () => {
      try {
        const result = await listWordsRequest(controller.signal);

        if (!controller.signal.aborted) {
          setWords(result);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setErrorMessage(
            getApiErrorMessage(error, "Unable to load your vocabulary"),
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadWords();

    return () => {
      controller.abort();
    };
  }, []);

  const handleDelete = async (word: Word) => {
    const confirmed = window.confirm(
      `Delete "${word.english}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeleteErrorMessage("");
    setDeletingWordId(word.id);

    try {
      await deleteWordRequest(word.id);

      setWords((currentWords) =>
        currentWords.filter((currentWord) => currentWord.id !== word.id),
      );
    } catch (error) {
      setDeleteErrorMessage(getApiErrorMessage(error, "Unable to delete word"));
    } finally {
      setDeletingWordId(null);
    }
  };

  if (isLoading) {
    return <p>Loading your vocabulary...</p>;
  }

  if (errorMessage) {
    return <p role="alert">{errorMessage}</p>;
  }

  if (words.length === 0) {
    return (
      <div>
        <p>You have not added any words yet.</p>
        <Link to="/words/new">Add your first word</Link>
      </div>
    );
  }

  return (
    <>
      <p>
        {words.length} {words.length === 1 ? "word" : "words"}
      </p>

      {deleteErrorMessage && <p role="alert">{deleteErrorMessage}</p>}

      <ul>
        {words.map((word) => (
          <li key={word.id}>
            <strong>{word.english}</strong>
            <div>Turkish: {word.turkish}</div>
            <div>Slovak: {word.slovak}</div>
            {word.notes && <div>Notes: {word.notes}</div>}
            <div>
              <Link to={`/words/${encodeURIComponent(word.id)}/edit`}>
                Edit
              </Link>{" "}
              <button
                type="button"
                onClick={() => void handleDelete(word)}
                disabled={deletingWordId !== null}
              >
                {deletingWordId === word.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Link to="/words/new">Add another word</Link>
    </>
  );
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = async () => {
    setErrorMessage("");
    setIsLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "You were signed out locally, but server logout could not be confirmed.",
        ),
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <section>
        <p>Checking your session...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section>
        <h1>Welcome to myVocab</h1>
        <p>Log in or create an account to start learning.</p>

        {errorMessage && <p role="alert">{errorMessage}</p>}

        <p>
          <Link to="/login">Login</Link>
          {" | "}
          <Link to="/register">Register</Link>
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1>Hello, {user.name}!</h1>
      <p>Signed in as {user.email}</p>

      <h2>Your vocabulary</h2>
      <WordList />

      <button type="button" onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </section>
  );
};
