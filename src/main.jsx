/* main.jsx  —  Application Root & Lifted State Owner
  
   This is the single source of truth for all top-level state.
   Every piece of state that needs to be shared across multiple
   components lives here and is passed down as props.

   STATE OWNED HERE:
   ─ user      null | { email, name }
    null  → show AuthScreen (login / signup)
    object → show ChatApp   (the chat interface)

   ─ theme     "light" | "dark"
    Persisted to localStorage so the preference
    survives page refreshes.

   ALSO MOUNTS:
   ─ useChat() hook — all chat logic (messages, input, typing…)
    Returned as a single `chat` object passed to ChatApp.

   RENDERS:
   ─ <AuthScreen>  when user is null
   ─ <ChatApp>     when user is set

   CSS IMPORTS (order matters — later files override earlier ones):
   1. global.css     — reset, design tokens, body base styles
   2. auth.css       — login / signup card
   3. chat.css       — shell, header, message area, bubbles
   4. components.css — code blocks, typing, quick replies, footer
   5. responsive.css — media queries (tablet + mobile)
   */

import { StrictMode, useState, useEffect } from "react";
import { createRoot }                       from "react-dom/client";

/* CSS imports — all styles in one folder */
import "./styles/global.css";      /* design tokens + reset                  */
import "./styles/auth.css";        /* login / signup card                    */
import "./styles/chat.css";        /* shell, header, messages, bubbles       */
import "./styles/components.css";  /* code blocks, typing, replies, footer   */
import "./styles/responsive.css";  /* tablet (≤768 px) + mobile (≤480 px)   */

/* Component imports */
import AuthScreen from "./components/AuthScreen";
import ChatApp    from "./components/ChatApp";

/* Hook import */
import { useChat } from "./hooks/useChat";

/* ROOT COMPONENT */
function App() {

  /* Auth state */
  /* null   → user is not logged in   → show AuthScreen
     object → user is logged in       → show ChatApp        */
  const [user, setUser] = useState(null);

  /* Theme state */
  /* Read the saved preference from localStorage on first render.
     Falls back to "light" if nothing is saved yet. */
  const [theme, setTheme] = useState(
    () => localStorage.getItem("ai-theme") || "light"
  );

  /* Sync the data-theme attribute on <html> whenever theme changes.
     All CSS [data-theme="dark"] rules react to this attribute. */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ai-theme", theme);           /* persist choice     */
  }, [theme]);

  /* Chat logic */
  /* useChat owns all message state, input state, and handlers.
     We call it here so its state is lifted above ChatApp,
     meaning it survives any ChatApp re-renders.            */
  const chat = useChat();

  /* Handlers */

  /* Flip between light and dark themes                      */
  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  /* Called by AuthScreen when login or signup succeeds.
     Receives { email, name } and stores it as the current user. */
  function handleAuth(loggedInUser) {
    setUser(loggedInUser);
  }

  /* Called by the Sign Out button inside ChatHeader.
     Clears the user → returns to AuthScreen.               */
  function handleSignOut() {
    setUser(null);
    chat.clearMessages();   /* also wipe the conversation history */
  }

  /* Render */
  return (
    <>
      {user
        /* Authenticated: full chat interface */
        ? <ChatApp
            user={user}
            theme={theme}
            toggleTheme={toggleTheme}
            onSignOut={handleSignOut}
            chat={chat}              /* entire chat state + handlers */
          />

        /* Unauthenticated: login / signup */
        : <AuthScreen
            onAuth={handleAuth}
            theme={theme}
            toggleTheme={toggleTheme}
          />
      }
    </>
  );
}

/* Mount */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
