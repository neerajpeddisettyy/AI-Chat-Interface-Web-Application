/* components/ChatHeader.jsx
   The sticky top bar of the chat interface.

   DISPLAYS:
   ─ Bot avatar icon + name + animated "Online" status dot
   ─ Logged-in user's display name
   ─ Dark / light mode toggle button
   ─ New conversation (reset) button
   ─ Sign Out button

   PROPS (all state and handlers lifted from main.jsx):
   ─ user          { email, name }  — logged-in user object
   ─ theme         "light" | "dark"
   ─ toggleTheme() — flips dark / light mode
   ─ onReset()     — clears all messages
   ─ onSignOut()   — signs out and returns to AuthScreen
*/

import { Sparkles, Sun, Moon, RotateCcw, LogOut } from "lucide-react";

export default function ChatHeader({ user, theme, toggleTheme, onReset, onSignOut }) {
  return (
    <header className="chat-header">

      {/* Left side: bot identity */}
      <div className="chat-header-left">

        {/* Rounded-square avatar holding the Sparkles icon */}
        <div className="chat-header-avatar">
          <Sparkles size={18} strokeWidth={1.8} />
        </div>

        {/* Bot name + animated online status */}
        <div className="chat-header-info">
          <span className="chat-header-name">AI Assistant</span>
          <span className="chat-header-status">
            {/* Pulsing green dot — animation defined in chat.css */}
            <span className="status-dot" />
            Online
          </span>
        </div>
      </div>

      {/* Right side: action buttons */}
      <div className="chat-header-actions">

        {/* Display the logged-in user's name next to the buttons */}
        <span
          style={{ fontSize: 13, color: "var(--text-secondary)", marginRight: 4 }}
          aria-label="Logged in as"
        >
          {user.name}
        </span>

        {/* Dark / light mode toggle — Sun in dark mode, Moon in light */}
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title="Toggle theme"
          aria-label="Toggle dark / light mode"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Clear all messages and restart the conversation    */}
        <button
          className="icon-btn"
          onClick={onReset}
          title="New conversation"
          aria-label="Start new conversation"
        >
          <RotateCcw size={15} strokeWidth={2} />
        </button>

        {/* Sign out — turns red on hover (see .icon-btn.signout in chat.css) */}
        <button
          className="icon-btn signout"
          onClick={onSignOut}
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={15} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
