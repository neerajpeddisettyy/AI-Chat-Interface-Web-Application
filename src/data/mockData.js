/*
  data/mockData.js
  Centralised mock data for auth and bot responses.

  REPLACE FOR PRODUCTION:
   ─ MOCK_USERS   → real auth API (Firebase, NextAuth, etc.)
   ─ BOT_RESPONSES → real AI API (OpenAI, Anthropic, etc.)
*/

/**
 * MOCK_USERS
 * Pre-seeded demo accounts so the login screen works immediately.
 * In production replace these checks with a real auth API call.
 */
export const MOCK_USERS = [
  { email: "demo@ai.com",  password: "demo123",  name: "Demo User" },
  { email: "admin@ai.com", password: "admin123", name: "Admin" },
];

/**
 * BOT_RESPONSES
 * Array of pre-written markdown-formatted replies.
 * One is chosen at random when the user sends a message.
 * In production replace with a real fetch() to your AI backend.
 */
export const BOT_RESPONSES = [
  /* Response 1 — key points list with inline code */
  `Sure! Here's a quick overview:\n\n**Key Points**\n- React uses a virtual DOM for performance\n- Components can be functional or class-based\n- State management is handled via hooks like \`useState\``,

  /* Response 2 — fenced code block with explanation */
  "Here's a simple example:\n\n```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\nconsole.log(greet('World'));\n```\n\nThis outputs **Hello, World!** to the console.",

  /* Response 3 — markdown table comparison */
  `Here's a framework comparison:\n\n| Feature | React | Vue | Angular |\n| --- | --- | --- | --- |\n| Learning Curve | Medium | Low | High |\n| Performance | Excellent | Excellent | Good |\n| Ecosystem | Very Large | Large | Large |`,

  /* Response 4 — ordered list steps */
  "To get started:\n\n1. Install Node.js from nodejs.org\n2. Run `npx create-react-app my-app`\n3. Navigate with `cd my-app`\n4. Start dev server with `npm start`",

  /* Response 5 — inline bold and italic */
  "Great question! The *main difference* is that **useState** manages local state, while **useEffect** handles side effects like data fetching, timers, or DOM updates.",
];

/**
 * QUICK_REPLIES
 * Suggestion chips shown above the input when the chat is empty
 * or after the bot sends its last message.
 */
export const QUICK_REPLIES = [
  { emoji: "💡", label: "Explain a concept" },
  { emoji: "🔧", label: "Debug my code" },
  { emoji: "📝", label: "Summarize text" },
  { emoji: "🚀", label: "Best practices" },
];

/**
 * STARTER_PROMPTS
 * Pre-written prompts shown as chips on the welcome card.
 * Clicking one immediately sends that text as a user message.
 */
export const STARTER_PROMPTS = [
  "Write a summary",
  "Explain async/await",
  "Debug this error",
  "Compare frameworks",
];
