/*
  hooks/useChat.js
   Custom hook that owns ALL chat state and logic.
   Returned values are consumed by main.jsx and passed as props
   to the individual chat components — no child manages its own
   chat state directly.
*/

import { useState, useRef, useEffect, useCallback } from "react";

/* Groq API CONFIGURATION
   1. Go to https://console.groq.com
   2. Create a free account and log in
   3. Click API Keys → Create API Key
   4. Paste it below */

const API_KEY = import.meta.env.VITE_GROQ_API_KEY; // API Key
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile"; // Best free model — fast + detailed

/* Prompt
   This tells the AI how to behave. Controls response quality.
   Edit this to change the AI's personality and detail level.  */
const SYSTEM_PROMPT = `You are Claude, a helpful, harmless, and honest AI assistant made by Anthropic.

Be genuinely helpful and direct. Match your response length to the question — short answers for simple questions, detailed answers for complex ones. Don't pad responses or add unnecessary filler.

Use formatting like bullet points, code blocks, or headers only when it actually helps clarity, not by default. Write in a natural, conversational tone. Be honest about what you don't know.`;

export function useChat() {
  /* State */

  /* Array of message objects: { id, role, text, ts }          */
  const [messages, setMessages] = useState([]);

  /* Current value of the message input textarea               */
  const [input, setInput] = useState("");

  /* True while the bot is "composing" — shows typing indicator */
  const [isTyping, setIsTyping] = useState(false);

  /* ID of the message whose copy button was recently clicked  */
  const [copiedId, setCopiedId] = useState(null);

  /* Set of message IDs the user has thumbed-up               */
  const [likedIds, setLikedIds] = useState(new Set());

  /* Refs */

  /* Invisible sentinel div at the bottom of the message list —
     scrollIntoView() on this element scrolls to the newest msg */
  const messagesEndRef = useRef(null);

  /* Ref on the textarea so we can auto-resize it on input change */
  const inputRef = useRef(null);

  /* Stores full conversation history for Groq (role + content) */
  const conversationRef = useRef([]);

  /* Hard character limit per message                          */
  const MAX_CHARS = 1000;

  /* Side Effects */

  /* Scroll to the bottom whenever a new message arrives or the
     typing indicator appears / disappears                      */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* Auto-resize the textarea height to fit its content,
     capped at 140 px to avoid dominating the screen           */
  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }, [input]);

  /* Handlers */

  /*
   * sendMessage
   * Appends the user's message, calls Groq API, then appends
   * the AI's real response. Maintains full conversation history
   * so the AI remembers previous messages in the chat.
   *
   * Accepts an optional `text` argument so quick-reply chips
   * and welcome chips can send pre-set messages directly.
   */
  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || input).trim();

      /* Block empty messages and spam while bot is typing      */
      if (!trimmed || isTyping) return;

      /* Add user message immediately to UI                     */
      const userMsg = {
        id:   Date.now(),
        role: "user",
        text: trimmed,
        ts:   Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      /* Add user message to conversation history for Groq      */
      conversationRef.current = [
        ...conversationRef.current,
        { role: "user", content: trimmed },
      ];

      try {
        /* Call Groq API */
        const response = await fetch(GROQ_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
              /* System prompt always first — sets AI behaviour */
              { role: "system", content: SYSTEM_PROMPT },
              /* Full conversation so AI remembers context       */
              ...conversationRef.current,
            ],
            max_tokens:  8192,  // Maximum response length
            temperature: 0.7,   // 0 = focused, 1 = creative
          }),
        });

        /* Handle API errors (wrong key, quota exceeded, etc.)  */
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error?.message || `API error ${response.status}`);
        }

        const data    = await response.json();
        const aiReply = data.choices[0].message.content;

        /* Save AI reply to conversation history               */
        conversationRef.current = [
          ...conversationRef.current,
          { role: "assistant", content: aiReply },
        ];

        /* Add AI reply to UI messages                         */
        const botMsg = {
          id:   Date.now(),
          role: "bot",
          text: aiReply,
          ts:   Date.now(),
        };
        setMessages((prev) => [...prev, botMsg]);

      } catch (error) {
        /* Show user-friendly error message in chat            */
        const errorMsg = {
          id:   Date.now(),
          role: "bot",
          text: `❌ **Error:** ${error.message}\n\nPlease check your API key or try again.`,
          ts:   Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [input, isTyping]
  );

  /**
   * handleKeyDown
   * Enter  → send the message.
   * Shift+Enter → insert a newline in the textarea.
   */
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  /**
   * handleInput
   * Updates the input state while capping at MAX_CHARS.
   */
  function handleInput(e) {
    if (e.target.value.length <= MAX_CHARS) setInput(e.target.value);
  }

  /**
   * handleCopyMessage
   * Copies a message's raw text to the clipboard and briefly
   * switches the copy icon to a ✓ tick for 1.8 s.
   */
  function handleCopyMessage(id, text) {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  }

  /**
   * toggleLike
   * Adds a message ID to likedIds if absent; removes it if present.
   */
  function toggleLike(id) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  /**
   * clearMessages
   * Wipes the conversation — called by the "New chat" reset button.
   * Also clears the Groq conversation history so context resets.
   */
  function clearMessages() {
    setMessages([]);
    conversationRef.current = []; // ← clears AI memory too
  }

  /* Return */
  return {
    /* State */
    messages,
    input,
    isTyping,
    copiedId,
    likedIds,
    MAX_CHARS,

    /* Refs */
    messagesEndRef,
    inputRef,

    /* Handlers */
    sendMessage,
    handleKeyDown,
    handleInput,
    handleCopyMessage,
    toggleLike,
    clearMessages,
  };
}
