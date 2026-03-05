/* components/ChatFooter.jsx
   The sticky bottom bar of the chat interface.

   CONTAINS:
   ─ <QuickReplies>  suggestion chips (conditional)
   ─ Input pill wrapper (textarea + char counter)
   ─ Circular send button
   ─ Keyboard shortcut hint text

   PROPS (all lifted from main.jsx via useChat hook):
   ─ input          current textarea string value
   ─ isTyping       true while bot is composing (disables send)
   ─ MAX_CHARS      hard character limit (default 1000)
   ─ inputRef       ref passed to the textarea for auto-resize
   ─ messages       message array (used to decide if chips show)
   ─ onInput(e)     onChange handler that enforces MAX_CHARS
   ─ onKeyDown(e)   Enter = send, Shift+Enter = newline
   ─ onSend()       fires sendMessage with current input value
   ─ onQuickSend(t) fires sendMessage with a pre-set text string
*/

import { Send } from "lucide-react";
import { QuickReplies } from "./ChatExtras";

export default function ChatFooter({
  input,
  isTyping,
  MAX_CHARS,
  inputRef,
  messages,
  onInput,
  onKeyDown,
  onSend,
  onQuickSend,
}) {
  /* Show quick-reply chips when the chat is empty OR immediately
     after the bot finishes its last reply                       */
  const showQuickReplies =
    messages.length === 0 ||
    (!isTyping && messages[messages.length - 1]?.role === "bot");

  return (
    <footer className="chat-footer">

      {/* Quick reply chips */}
      {/* Conditionally rendered — hidden while bot is typing  */}
      {showQuickReplies && <QuickReplies onSend={onQuickSend} />}

      {/* Input row */}
      <div className="input-row" style={{ marginTop: 12 }}>

        {/* Pill wrapper around the textarea and char counter  */}
        <div className="input-wrapper">

          {/* Auto-growing textarea:
              Enter        → sends the message
              Shift+Enter  → inserts a newline
              Height is adjusted in the useChat hook via inputRef  */}
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Type your message..."
            value={input}
            onChange={onInput}
            onKeyDown={onKeyDown}
            rows={1}
            aria-label="Message input"
          />

          {/* Character counter — only appears after 80 % of the limit */}
          {input.length > MAX_CHARS * 0.8 && (
            <span
              className={`char-counter ${input.length > MAX_CHARS * 0.95 ? "warn" : ""}`}
              aria-live="polite"
            >
              {input.length}/{MAX_CHARS}
            </span>
          )}
        </div>

        {/* Send button */}
        {/* Disabled when input is empty or bot is still typing */}
        <button
          className="send-btn"
          onClick={onSend}
          disabled={!input.trim() || isTyping}
          aria-label="Send message"
        >
          <Send size={17} strokeWidth={2.2} />
        </button>
      </div>

      {/* Keyboard shortcut reminder */}
      <p className="footer-hint">Enter to send · Shift + Enter for new line</p>
    </footer>
  );
}
