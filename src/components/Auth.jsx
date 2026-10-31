import { useState } from "react";
import { signIn, signUp } from "../services/auth";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (mode === "signup") {
        const data = await signUp(
          normalizedEmail,
          password,
          displayName.trim()
        );

        console.log("Sign-up response:", data);

        if (!data.session) {
          setMessage(
            "Account created. Check your email and click the confirmation link before logging in."
          );
        } else {
          setMessage("Account created and logged in.");
        }

        setPassword("");
        setDisplayName("");
      } else {
        const data = await signIn(
          normalizedEmail,
          password
        );

        console.log("Sign-in successful:", data.user);

        setMessage("Logged in successfully.");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode((currentMode) =>
      currentMode === "login" ? "signup" : "login"
    );

    setError("");
    setMessage("");
    setPassword("");
  }

  return (
    <main>
      <h1>
        {mode === "login" ? "Log in" : "Create an account"}
      </h1>

      <form onSubmit={handleSubmit}>
        {mode === "signup" && (
          <label>
            Display name
            <input
              type="text"
              value={displayName}
              onChange={(event) =>
                setDisplayName(event.target.value)
              }
              required
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            minLength={6}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Log in"
            : "Sign up"}
        </button>
      </form>

      {error && (
        <p style={{ color: "crimson" }}>
          {error}
        </p>
      )}

      {message && (
        <p style={{ color: "green" }}>
          {message}
        </p>
      )}

      <button type="button" onClick={switchMode}>
        {mode === "login"
          ? "Need an account? Sign up"
          : "Already have an account? Log in"}
      </button>
    </main>
  );
}
