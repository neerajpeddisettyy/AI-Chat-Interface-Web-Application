/* 
  components/CodeBlock.jsx
  Renders a fenced code block (triple-backtick markdown).

  DISPLAYS:
   ─ A header bar with the language label and a copy button
   ─ Scrollable <pre> content that preserves all indentation

  PROPS:
   ─ lang {string}  — language identifier (e.g. "javascript")
   ─ code {string}  — the raw code string to display
*/

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CodeBlock({ lang, code }) {
  /* Track whether the copy action just fired so we can show a ✓ */
  const [copied, setCopied] = useState(false);

  /* Copy code to clipboard and revert the icon after 1.8 s   */
  function handleCopy() {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="code-block">

      {/* Header bar: language label on left, copy button on right */}
      <div className="code-block-header">
        <span className="code-lang">{lang || "code"}</span>

        <button className="copy-btn" onClick={handleCopy}>
          {/* Swap Copy icon for Check icon briefly after clicking */}
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code content — white-space:pre set in CSS preserves indentation */}
      <pre>{code}</pre>
    </div>
  );
}
