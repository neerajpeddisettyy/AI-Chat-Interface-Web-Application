/*
  components/AuthScreen.jsx
  Login and Signup card UI.

  STATE OWNED HERE (local only — UI concerns):
   ─ mode      "login" | "signup"
   ─ name      display name (signup only)
   ─ email     email address
   ─ password  password string
   ─ showPass  toggle password visibility
   ─ error     inline validation / auth error message
   ─ loading   true while the async auth call is in flight

  PROPS (all state lifted to main.jsx):
   ─ onAuth(user)   called with { email, name } on success
   ─ theme          "light" | "dark"  (controls Sun/Moon icon)
   ─ toggleTheme()  flips dark / light mode
*/

import { useState } from "react";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import { MOCK_USERS } from "../data/mockData";

export default function AuthScreen({ onAuth, theme, toggleTheme }) {
  /* Local UI state */
  const [mode,     setMode]     = useState("login");  /* which form is shown   */
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);    /* eye-icon toggle       */
  const [error,    setError]    = useState("");       /* inline error message  */
  const [loading,  setLoading]  = useState(false);   /* disables submit btn   */

  /* Form submission */
  async function handleSubmit() {
    /* Basic required-field validation */
    if (!email.trim() || !password.trim())
      return setError("Email and password are required.");
    if (mode === "signup" && !name.trim())
      return setError("Please enter your display name.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");

    setError("");
    setLoading(true);

    /* Simulate a 700 ms network delay.
       REPLACE with: const res = await fetch('/api/auth', { … }) */
    await new Promise((r) => setTimeout(r, 700));

    if (mode === "login") {
      /* Check against the mock user list */
      const found = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );
      if (!found) {
        setLoading(false);
        return setError("Incorrect email or password.");
      }
      /* Lift authenticated user up to main.jsx */
      onAuth({ email: found.email, name: found.name });

    } else {
      /* Signup: reject duplicate emails */
      const exists = MOCK_USERS.find((u) => u.email === email);
      if (exists) {
        setLoading(false);
        return setError("An account with this email already exists.");
      }
      /* Register in mock list and sign in immediately */
      MOCK_USERS.push({ email, password, name });
      onAuth({ email, name });
    }

    setLoading(false);
  }

  /* Allow Enter key in any field to submit the form           */
  function handleKey(e) {
    if (e.key === "Enter") handleSubmit();
  }

  /* Switch between login and signup — resets sensitive fields */
  function switchMode() {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError("");
    setPassword("");
    setName("");
  }

  /* Render */
  return (
    <div className="auth-page">

      {/* Theme toggle — fixed to top-right corner of the page */}
      <button
        className="auth-theme-btn"
        onClick={toggleTheme}
        title="Toggle theme"
        aria-label="Toggle dark / light mode"
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="auth-card">

        {/* Brand section */}
        {/* Icon, app name, and contextual tagline             */}
        <div className="auth-brand">
          <div className="auth-brand-icon"> 
          <img src="/cardano-ada-seeklogo.png" alt="Logo" width={28} height={28} style={{ objectFit: "contain" }} />
          </div>
          <span className="auth-brand-name">AI Assistant</span>
          <span className="auth-brand-sub">
            {mode === "login"
              ? "Welcome back — sign in to continue"
              : "Create a free account to get started"}
          </span>
        </div>

        {/* ── Form fields */}
        <div className="auth-form">

          {/* Display name — only visible during signup */}
          {mode === "signup" && (
            <div className="auth-field">
              <label className="auth-label">Display Name</label>
              <div className="auth-input-wrap">
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          {/* Email address */}
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKey}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password with show / hide toggle */}
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <input
                className="auth-input has-toggle"
                type={showPass ? "text" : "password"}
                placeholder={mode === "login" ? "Your password" : "Min. 6 characters"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKey}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              {/* Eye icon toggles between show and hide       */}
              <button
                className="auth-eye"
                onClick={() => setShowPass((s) => !s)}
                tabIndex={-1}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Inline error banner — only rendered when error is non-empty */}
          {error && <div className="auth-error" role="alert">{error}</div>}

          {/* Submit button */}
          <button
            className="auth-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>

        {/* Mode switcher */}
        {/* "Already have an account? Sign In" */}
        <div className="auth-switch">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button onClick={switchMode}>
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
