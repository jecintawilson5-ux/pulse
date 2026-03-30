// Client-side vote rate limiting
const VOTE_COOLDOWN_MS = 1000;
const MAX_VOTES_PER_MINUTE = 10;

interface VoteRecord {
  timestamps: number[];
}

const voteRecords = new Map<string, number>(); // answerId -> last vote time
let recentVotes: number[] = [];

export function canVote(answerId: string): { allowed: boolean; waitMs: number; message?: string } {
  const now = Date.now();

  // Per-answer cooldown
  const lastVote = voteRecords.get(answerId);
  if (lastVote && now - lastVote < VOTE_COOLDOWN_MS) {
    return {
      allowed: false,
      waitMs: VOTE_COOLDOWN_MS - (now - lastVote),
      message: "You just voted on this. Wait a moment.",
    };
  }

  // Global rate limit
  recentVotes = recentVotes.filter((t) => now - t < 60000);
  if (recentVotes.length >= MAX_VOTES_PER_MINUTE) {
    const oldestInWindow = recentVotes[0];
    const waitMs = 60000 - (now - oldestInWindow);
    return {
      allowed: false,
      waitMs,
      message: `You're voting too fast. Wait ${Math.ceil(waitMs / 1000)} seconds.`,
    };
  }

  return { allowed: true, waitMs: 0 };
}

export function recordVote(answerId: string) {
  const now = Date.now();
  voteRecords.set(answerId, now);
  recentVotes.push(now);
}
