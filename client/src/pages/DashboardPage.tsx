import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../api/api-error";
import { useAuth } from "../auth/use-auth";

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
      <p>Vocabulary statistics will appear here later.</p>

      <button type="button" onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </section>
  );
};
