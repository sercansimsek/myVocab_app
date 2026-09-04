import { useState, type FormEvent } from "react";
import { getApiErrorMessage } from "../api/api-error";
import { createWordRequest } from "../api/word-api";

export const NewWordPage = () => {
  const [english, setEnglish] = useState("");
  const [turkish, setTurkish] = useState("");
  const [slovak, setSlovak] = useState("");
  const [notes, setNotes] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const word = await createWordRequest({
        english,
        turkish,
        slovak,
        notes,
      });

      setSuccessMessage(`"${word.english}" was added successfully.`);

      setEnglish("");
      setTurkish("");
      setSlovak("");
      setNotes("");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to add word"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h1>Add New Word</h1>
      <p>Add a new word to your vocabulary.</p>

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

        {errorMessage && <p role="alert">{errorMessage}</p>}

        {successMessage && <p role="status">{successMessage}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Word"}
        </button>
      </form>
    </section>
  );
};
