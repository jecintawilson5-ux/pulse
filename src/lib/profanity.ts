// Simple client-side profanity filter
const SEVERE_WORDS = [
  "fuck", "shit", "ass", "bitch", "damn", "cunt", "dick", "cock",
  "pussy", "nigger", "faggot", "retard",
];

const MILD_WORDS = [
  "hell", "crap", "suck", "stupid", "idiot", "dumb",
];

export function checkProfanity(text: string): { severity: "none" | "mild" | "severe"; words: string[] } {
  const lower = text.toLowerCase();
  const words: string[] = [];

  for (const w of SEVERE_WORDS) {
    if (new RegExp(`\\b${w}\\b`, "i").test(lower)) {
      words.push(w);
    }
  }
  if (words.length > 0) return { severity: "severe", words };

  for (const w of MILD_WORDS) {
    if (new RegExp(`\\b${w}\\b`, "i").test(lower)) {
      words.push(w);
    }
  }
  if (words.length > 0) return { severity: "mild", words };

  return { severity: "none", words: [] };
}
