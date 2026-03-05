/* 
   components/ChatExtras.jsx
   Small presentational components used inside the chat area.

   EXPORTS:
   ─ DateDivider      — horizontal rule with a date label
   ─ TypingIndicator  — three bouncing dots while bot is typing
   ─ WelcomeCard      — empty-state greeting with starter chips
   ─ QuickReplies     — suggestion chips above the input
*/

import { Sparkles, Bot } from "lucide-react";
import { QUICK_REPLIES, STARTER_PROMPTS } from "../data/mockData";

/* DateDivider
   A full-width horizontal rule with a centred date label.
   Rendered between message groups when the date changes.

   PROPS:
   ─ label {string}  — e.g. "Today", "Yesterday", "Jan 15"    */
export function DateDivider({ label }) {
  return (
    <div className="date-divider" role="separator" aria-label={label}>
      <div className="date-divider-line" />
      <span className="date-divider-label">{label}</span>
      <div className="date-divider-line" />
    </div>
  );
}

/* TypingIndicator
   Shown while isTyping is true (bot is composing a reply).
   Three dots bounce in sequence using CSS animation-delay.    */
export function TypingIndicator() {
  return (
    <div className="typing-row" aria-label="Bot is typing">
      {/* Bot avatar matching the style used in MessageBubble  */}
      <div className="msg-avatar bot">
        <Bot size={14} strokeWidth={2} />
      </div>

      {/* Bubble containing the three animated dots  */}
      <div className="typing-bubble">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}

/* WelcomeCard
   Centred placeholder rendered when the message list is empty.
   Contains the brand icon, a greeting headline, and starter
   chips that fire pre-set messages when clicked.

   PROPS:
   ─ onSend(text)  — sends the clicked prompt as a user message */
export function WelcomeCard({ onSend }) {
  return (
    <div className="welcome-card">
      {/* Brand icon */}
      <div className="welcome-icon">
        <Sparkles size={26} strokeWidth={1.5} />
      </div>

      {/* Greeting */}
      <h2 className="welcome-title">How can I help you today?</h2>
      <p className="welcome-subtitle">
        Ask me anything — code, concepts, analysis, or creative writing.
      </p>

      {/* Starter prompt chips — clicking one sends that message */}
      <div className="welcome-chips">
        {STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            className="welcome-chip"
            onClick={() => onSend(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* QuickReplies
   Row of suggestion chips shown above the input bar.
   Visible when the chat is empty or after the bot's last reply.

   PROPS:
   ─ onSend(label)  — sends the clicked suggestion as a user message */
export function QuickReplies({ onSend }) {
  return (
    <div className="quick-replies">
      <span className="quick-replies-label">Suggestions</span>

      {QUICK_REPLIES.map(({ emoji, label }) => (
        <button
          key={label}
          className="quick-reply-btn"
          onClick={() => onSend(label)}
        >
          <span>{emoji}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
