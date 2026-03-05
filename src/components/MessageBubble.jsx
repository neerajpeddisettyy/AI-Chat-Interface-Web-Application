/*
  components/MessageBubble.jsx
  Renders a single message row including:
   ─ Avatar tile (User icon or Bot icon)
   ─ Chat bubble (plain text for user, markdown for bot)
   ─ Meta row: timestamp, copy button, thumbs up / down

  PROPS (all lifted from main.jsx via useChat hook):
   ─ msg           { id, role, text, ts }
   ─ copiedId      ID of recently-copied message (for ✓ icon)
   ─ likedIds      Set of liked message IDs (for green thumb)
   ─ onCopy(id, text)  — copies text, sets copiedId
   ─ onLike(id)        — toggles liked state
*/

import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { renderMarkdown } from "./MarkdownRenderer";
import { formatTime } from "../utils/helpers";

export default function MessageBubble({ msg, copiedId, likedIds, onCopy, onLike }) {
  /* Convenience flag used to conditionally render user vs bot styles */
  const isUser = msg.role === "user";

  return (
    /* Row wrapper — .user applies row-reverse (right alignment)
                   .bot  keeps normal row (left alignment)        */
    <div className={`msg-row ${msg.role}`}>

      {/* Avatar */}
      <div className={`msg-avatar ${msg.role}`}>
        {isUser
          ? <User size={14} strokeWidth={2.2} />
          : <Bot  size={14} strokeWidth={2} />}
      </div>

      {/* Column: bubble + meta */}
      <div className="msg-col">

        {/* Bubble */}
        {/* User messages are plain text.
            Bot messages are parsed through renderMarkdown()  */}
        <div className={`msg-bubble ${msg.role}`}>
          {isUser ? msg.text : renderMarkdown(msg.text)}
        </div>

        {/* Meta row */}
        {/* Timestamp always visible; action buttons reveal on hover */}
        <div className="msg-meta">

          {/* Timestamp — formatted to HH:MM                  */}
          <span className="msg-time">{formatTime(msg.ts)}</span>

          {/* Hover-revealed action buttons                    */}
          <div className="msg-actions">

            {/* Copy raw message text to clipboard */}
            <button
              className="msg-action-btn"
              title="Copy message"
              onClick={() => onCopy(msg.id, msg.text)}
              aria-label="Copy message"
            >
              {/* ✓ icon shows briefly after copy, then reverts */}
              {copiedId === msg.id ? <Check size={11} /> : <Copy size={11} />}
            </button>

            {/* Thumbs up / down — only shown on bot messages  */}
            {!isUser && (
              <>
                <button
                  className="msg-action-btn"
                  title="Helpful"
                  aria-label="Mark as helpful"
                  /* Turn accent green when this message is liked */
                  style={{ color: likedIds.has(msg.id) ? "var(--accent)" : undefined }}
                  onClick={() => onLike(msg.id)}
                >
                  <ThumbsUp size={11} />
                </button>

                <button
                  className="msg-action-btn"
                  title="Not helpful"
                  aria-label="Mark as not helpful"
                >
                  <ThumbsDown size={11} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
