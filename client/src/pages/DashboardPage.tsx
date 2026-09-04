import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../api/api-error";
import { deleteWordRequest, listWordsRequest } from "../api/word-api";
import { useAuth } from "../auth/use-auth";
import type { Word, Pagination } from "../types/word";

const PAGE_SIZE = 10;

const initialPagination: Pagination = {
  page: 1,
  limit: PAGE_SIZE,
  totalItems: 0,
  totalPages: 0,
};

const WordList = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reloadVersion, setReloadVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingWordId, setDeletingWordId] = useState<string | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadWords = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const result = await listWordsRequest(
          {
            search: search || undefined,
            page,
            limit: PAGE_SIZE,
          },
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setWords(result.words);
          setPagination(result.pagination);
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
  }, [page, reloadVersion, search]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setPage(1);
    setSearch("");
  };

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

      if (words.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        setReloadVersion((currentVersion) => currentVersion + 1);
      }
    } catch (error) {
      setDeleteErrorMessage(getApiErrorMessage(error, "Unable to delete word"));
    } finally {
      setDeletingWordId(null);
    }
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <label htmlFor="word-search">Search vocabulary</label>
        <div>
          <input
            id="word-search"
            name="search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            maxLength={255}
            placeholder="Search English, Turkish, Slovak, or notes"
          />
          <button type="submit" disabled={isLoading}>
            Search
          </button>
          {(searchInput || search) && (
            <button
              type="button"
              onClick={handleClearSearch}
              disabled={isLoading}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {isLoading ? (
        <p>Loading your vocabulary...</p>
      ) : errorMessage ? (
        <p role="alert">{errorMessage}</p>
      ) : words.length === 0 ? (
        search ? (
          <div>
            <p>No words match “{search}”.</p>
            <button type="button" onClick={handleClearSearch}>
              Clear search
            </button>
          </div>
        ) : (
          <div>
            <p>You have not added any words yet.</p>
            <Link to="/words/new">Add your first word</Link>
          </div>
        )
      ) : (
        <>
          <p>
            {pagination.totalItems}{" "}
            {pagination.totalItems === 1 ? "word" : "words"} found
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

          {pagination.totalPages > 1 && (
            <nav aria-label="Vocabulary pages">
              <button
                type="button"
                onClick={() =>
                  setPage((currentPage) => Math.max(1, currentPage - 1))
                }
                disabled={pagination.page === 1}
              >
                Previous
              </button>

              <span>
                {" "}
                Page {pagination.page} of {pagination.totalPages}{" "}
              </span>

              <button
                type="button"
                onClick={() =>
                  setPage((currentPage) =>
                    Math.min(pagination.totalPages, currentPage + 1),
                  )
                }
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </button>
            </nav>
          )}

          <Link to="/words/new">Add another word</Link>
        </>
      )}
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

      <p>
        <Link to="/practice">Start practice</Link>
      </p>

      <h2>Your vocabulary</h2>
      <WordList />

      <button type="button" onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </section>
  );
};
