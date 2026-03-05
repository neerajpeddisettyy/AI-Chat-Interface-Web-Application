/*
  components/MarkdownRenderer.jsx
  Lightweight markdown parser — zero external dependencies.

  SUPPORTED SYNTAX:
   Inline tokens (within each line):
   ─ **bold**   →  <strong>
   ─ *italic*   →  <em>
   ─ `code`     →  <code className="inline-code">
*/

import CodeBlock from "./CodeBlock";

/* inlineMarkdown
   Parses inline tokens within a single line of text.
   Returns an array of strings and React elements. */
export function inlineMarkdown(text) {
  const parts = [];

  /* Regex matches bold (**…**), italic (*…*), or inline code (`…`) */
  const rx = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let m;

  while ((m = rx.exec(text)) !== null) {
    /* Push any plain text before this token */
    if (m.index > last) parts.push(text.slice(last, m.index));

    const s = m[0];
    if (s.startsWith("**"))      parts.push(<strong key={m.index}>{s.slice(2, -2)}</strong>);
    else if (s.startsWith("*")) parts.push(<em key={m.index}>{s.slice(1, -1)}</em>);
    else if (s.startsWith("`")) parts.push(<code key={m.index} className="inline-code">{s.slice(1, -1)}</code>);

    last = m.index + s.length;
  }

  /* Push any remaining plain text after the last token */
  if (last < text.length) parts.push(text.slice(last));
  return parts.length > 0 ? parts : text;
}

/* renderMarkdown
   Parses a full multi-line message string into React elements.

   @param {string} text — raw markdown message
   @returns {JSX.Element[]} — array of React block elements */
export function renderMarkdown(text) {
  const lines    = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* Fenced code block  ``` … ``` */
    if (line.startsWith("```")) {
      const lang      = line.slice(3).trim();
      const codeLines = [];
      i++;
      /* Collect all lines until the closing ``` marker */
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(<CodeBlock key={i} lang={lang} code={codeLines.join("\n")} />);
      i++; /* skip the closing ``` */
      continue;
    }

    /* ── Table  (pipe-delimited, second row is --- separator) */
    if (line.includes("|") && lines[i + 1]?.includes("---")) {
      const headers = line.split("|").filter(Boolean).map((h) => h.trim());
      i += 2; /* skip header row and separator row              */
      const rows = [];
      while (i < lines.length && lines[i].includes("|")) {
        rows.push(lines[i].split("|").filter(Boolean).map((c) => c.trim()));
        i++;
      }
      elements.push(
        <table key={i}>
          <thead>
            <tr>{headers.map((h, j) => <th key={j}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, j) => (
              <tr key={j}>
                {r.map((c, k) => <td key={k}>{inlineMarkdown(c)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      );
      continue;
    }

    /* H3 heading */
    if (line.startsWith("### ")) {
      elements.push(<h3 key={i}>{line.slice(4)}</h3>);
      i++;
      continue;
    }

    /* Unordered list */
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(<li key={i}>{inlineMarkdown(lines[i].slice(2))}</li>);
        i++;
      }
      elements.push(<ul key={i}>{items}</ul>);
      continue;
    }

    /* Ordered list  1. 2. 3. */
    if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(<li key={i}>{inlineMarkdown(lines[i].replace(/^\d+\. /, ""))}</li>);
        i++;
      }
      elements.push(<ol key={i}>{items}</ol>);
      continue;
    }

    /* Skip blank lines */
    if (line.trim() === "") { i++; continue; }

    /* Default: plain paragraph */
    elements.push(<p key={i}>{inlineMarkdown(line)}</p>);
    i++;
  }

  return elements;
}
