import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { getApiErrorMessage } from "../api/api-error";
import { getWordRequest, updateWordRequest } from "../api/word-api";

export const EditWordPage = () => {
  const { wordId } = useParams<{ wordId: string }>();

  const [english, setEnglish] = useState("");
  const [turkish, setTurkish] = useState("");
  const [slovak, setSlovak] = useState("");
  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!wordId) {
      return;
    }

    const controller = new AbortController();

    const loadWord = async () => {
      try {
        const word = await getWordRequest(wordId, controller.signal);

        if (!controller.signal.aborted) {
          setEnglish(word.english);
          setTurkish(word.turkish);
          setSlovak(word.slovak);
          setNotes(word.notes ?? "");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadErrorMessage(getApiErrorMessage(error, "Unable to load word"));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadWord();

    return () => {
      controller.abort();
    };
  }, [wordId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!wordId) {
      return;
    }

    setSubmitErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const word = await updateWordRequest(wordId, {
        english,
        turkish,
        slovak,
        notes,
      });

      setEnglish(word.english);
      setTurkish(word.turkish);
      setSlovak(word.slovak);
      setNotes(word.notes ?? "");
      setSuccessMessage(`"${word.english}" was updated successfully.`);
    } catch (error) {
      setSubmitErrorMessage(getApiErrorMessage(error, "Unable to update word"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!wordId) {
    return (
      <section>
        <p role="alert">Word ID is missing.</p>
        <Link to="/">Return to dashboard</Link>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section>
        <p>Loading word...</p>
      </section>
    );
  }

  if (loadErrorMessage) {
    return (
      <section>
        <p role="alert">{loadErrorMessage}</p>
        <Link to="/">Return to dashboard</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Edit Word</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="english">English</label>
          <input
            id="english"
            name="english"
            type="text"
            value={english}
            onChange={(event) => setEnglish(event.target.value)}
            maxLength={255}
            required
          />
        </div>

        <div>
          <label htmlFor="turkish">Turkish</label>
          <input
            id="turkish"
            name="turkish"
            type="text"
            value={turkish}
            onChange={(event) => setTurkish(event.target.value)}
            maxLength={255}
            required
          />
        </div>

        <div>
          <label htmlFor="slovak">Slovak</label>
          <input
            id="slovak"
            name="slovak"
            type="text"
            value={slovak}
            onChange={(event) => setSlovak(event.target.value)}
            maxLength={255}
            required
          />
        </div>

        <div>
          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={2000}
          />
        </div>

        {submitErrorMessage && <p role="alert">{submitErrorMessage}</p>}

        {successMessage && <p role="status">{successMessage}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <Link to="/">Return to dashboard</Link>
    </section>
  );
};
