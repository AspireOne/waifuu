/**
 * Generates a random UUID (Universally Unique Identifier).
 * Example: 8b3e8a1e-4b9b-4b4b-9b9b-4b9b4b9b4b9b
 * @returns {string} A randomly generated UUID string.
 */
export default function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
