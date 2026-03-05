# AI Chat Interface

A modern AI-powered chat application built with React and Vite, using the Groq API with the LLaMA 3.3 70B model.

---

## Screenshots

### Login Screen
![Login](/public/Screenshot%201.png)

### Sign Up Screen
![Signup](/public/Screenshot%202.png)

### Chat Interface
![Chat](/public/Screenshot%203.png)

### Dark Mode
![Dark Mode](/public/Screenshot%204.png)

### AI Response
![Response](/public/Screenshot%205.png)

---

## Features

-  Login & Signup with mock authentication
-  AI responses powered by Groq API (LLaMA 3.3 70B)
-  Dark / Light mode toggle
-  Full conversation history (AI remembers context)
-  Copy messages to clipboard
-  Like / dislike AI responses
-  Quick reply suggestion chips
-  Responsive design (mobile + desktop)
-  Auto-resizing textarea input
-  Markdown rendering (bold, italic, code blocks, tables, lists)

---

##  Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Custom CSS with CSS variables (light/dark themes)
- **AI Model:** LLaMA 3.3 70B via Groq API
- **Icons:** Lucide React
- **Deployment:** Vercel / Firebase

---

##  Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/neerajpeddisettyy/AI-Chat-Interface-Web-Application.git
cd AI-Chat-Interface-Web-Application
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file in the root folder

```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Get your free API key at [console.groq.com](https://console.groq.com)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production

```bash
npm run build
```

---

##  Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_GROQ_API_KEY` | Your Groq API key from console.groq.com |

>  Never commit your `.env` file to GitHub. It is already listed in `.gitignore`.

---

##  Project Structure

```
src/
├── components/
│   ├── AuthScreen.jsx       # Login & Signup UI
│   ├── ChatApp.jsx          # Main chat layout shell
│   ├── ChatHeader.jsx       # Top bar with controls
│   ├── ChatFooter.jsx       # Input area & suggestions
│   ├── ChatExtras.jsx       # Welcome card, typing indicator
│   ├── MessageBubble.jsx    # Individual message component
│   ├── MarkdownRenderer.jsx # Markdown parser
│   └── CodeBlock.jsx        # Code block with copy button
├── hooks/
│   └── useChat.js           # All chat state & Groq API logic
├── data/
│   └── mockData.js          # Mock users & quick replies
├── utils/
│   └── helpers.js           # Date/time formatting
└── styles/
    ├── global.css           # Design tokens & reset
    ├── auth.css             # Login/signup styles
    ├── chat.css             # Chat interface styles
    ├── components.css       # Component-level styles
    └── responsive.css       # Mobile & tablet breakpoints
```

---

##  Demo Login

You can use the mock credentials to test login:

| Email | Password |
|-------|----------|
| demo@example.com | password |

Or click **Sign Up** to create a new account.

---

##  Deployment

### Deploy to Vercel

1. Push your code to GitHub (without `.env`)
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add environment variable `VITE_GROQ_API_KEY` in Vercel dashboard
4. Click Deploy

### Deploy to Firebase

```bash
npm run build
firebase deploy
```

---

by [Neeraj Peddisetty](https://github.com/neerajpeddisettyy)
