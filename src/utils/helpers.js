/* utils/helpers.js
  Pure utility functions shared across components.
  No side effects — safe to import anywhere.
  */

/**
 * formatTime
 * Converts a Unix timestamp (ms) into a readable HH:MM string.
 * Used in MessageBubble to stamp each message.
 *
 * @param {number} ts  - timestamp in milliseconds
 * @returns {string}   - e.g. "09:41" or "2:05 PM" depending on locale
 */
export function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * formatDate
 * Returns a human-friendly label for a date.
 * Used in the date divider between message groups.
 *
 * @param {number} ts  - timestamp in milliseconds
 * @returns {string}   - "Today", "Yesterday", or "Jan 15"
 */
export function formatDate(ts) {
  const msgDate   = new Date(ts);
  const today     = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (msgDate.toDateString() === today.toDateString())     return "Today";
  if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";

  return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
}

/**
 * didDateChange
 * Returns true when two consecutive messages fall on different dates.
 * Used to decide whether to render a DateDivider between them.
 *
 * @param {number} prevTs  - previous message timestamp (ms)
 * @param {number} currTs  - current message timestamp (ms)
 * @returns {boolean}
 */
export function didDateChange(prevTs, currTs) {
  return new Date(prevTs).toDateString() !== new Date(currTs).toDateString();
}
