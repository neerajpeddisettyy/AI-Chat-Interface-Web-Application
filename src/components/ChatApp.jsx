/* 
  components/ChatApp.jsx
  The main chat interface — assembles all chat sub-components.

  RESPONSIBILITY:
   This component is a "layout shell" only. It receives all
   state and handlers from main.jsx (lifted state) and wires
   them to the correct child components. No state lives here.

  PROPS (all lifted from main.jsx):
   ─ user            { email, name }  — logged-in user
   ─ theme           "light" | "dark"
   ─ toggleTheme()   flips dark / light mode
   ─ onSignOut()     signs out → shows AuthScreen
   ─ chat            object returned by useChat() hook:
       .messages         array of { id, role, text, ts }
       .input            current textarea value
       .isTyping         true while bot is composing
       .copiedId         ID of recently-copied message
       .likedIds         Set of liked message IDs
       .MAX_CHARS        character limit
       .messagesEndRef   ref for auto-scroll sentinel div
       .inputRef         ref for textarea auto-resize
       .sendMessage()    sends a message (accepts optional text)
       .handleKeyDown()  Enter=send, Shift+Enter=newline
       .handleInput()    enforces MAX_CHARS on textarea change
       .handleCopyMessage()  copies text + shows ✓ icon
       .toggleLike()     toggles thumbs-up on a message
       .clearMessages()  resets the conversation
*/

import ChatHeader    from "./ChatHeader";
import ChatFooter    from "./ChatFooter";
import MessageBubble from "./MessageBubble";
import { DateDivider, TypingIndicator, WelcomeCard } from "./ChatExtras";
import { didDateChange, formatDate } from "../utils/helpers";

export default function ChatApp({ user, theme, toggleTheme, onSignOut, chat }) {
  /* Destructure everything from the chat object for cleaner JSX */
  const {
    messages,
    input,
    isTyping,
    copiedId,
    likedIds,
    MAX_CHARS,
    messagesEndRef,
    inputRef,
    sendMessage,
    handleKeyDown,
    handleInput,
    handleCopyMessage,
    toggleLike,
    clearMessages,
  } = chat;

  return (
    <div className="chat-shell">

      {/* HEADER */}
      {/* Sticky top bar: bot identity, theme toggle, sign out */}
      <ChatHeader
        user={user}
        theme={theme}
        toggleTheme={toggleTheme}
        onReset={clearMessages}
        onSignOut={onSignOut}
      />

      {/* MESSAGE AREA */}
      {/* flex:1 fills remaining height; overflow-y:auto scrolls */}
      <main className="chat-messages">

        {/* Empty state — welcome card with starter prompts */}
        {messages.length === 0 && (
          <WelcomeCard onSend={sendMessage} />
        )}

        {/* Render each message with optional date divider */}
        {messages.map((msg, idx) => {
          /* Insert a date divider when the message date changes */
          const showDivider =
            idx === 0 ||
            didDateChange(messages[idx - 1].ts, msg.ts);

          return (
            <div key={msg.id}>
              {/* Date label divider — e.g. "TODAY" or "Jan 15" */}
              {showDivider && (
                <DateDivider label={formatDate(msg.ts)} />
              )}

              {/* The message bubble row itself */}
              <MessageBubble
                msg={msg}
                copiedId={copiedId}
                likedIds={likedIds}
                onCopy={handleCopyMessage}
                onLike={toggleLike}
              />
            </div>
          );
        })}

        {/* Typing indicator — visible while bot is composing  */}
        {isTyping && <TypingIndicator />}

        {/* Invisible sentinel — auto-scroll targets this div  */}
        <div ref={messagesEndRef} />
      </main>

      {/* FOOTER */}
      {/* Sticky bottom bar: quick replies + textarea + send   */}
      <ChatFooter
        input={input}
        isTyping={isTyping}
        MAX_CHARS={MAX_CHARS}
        inputRef={inputRef}
        messages={messages}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onSend={() => sendMessage()}
        onQuickSend={sendMessage}
      />
    </div>
  );
}
