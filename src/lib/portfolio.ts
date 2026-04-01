import { supabase } from "@/integrations/supabase/client";
import { getSessionId, getActivity } from "@/lib/activity";

export interface DomainScore {
  domain: string;
  score: number;
  level: "Novice" | "Proficient" | "Expert" | "Authority";
  answersCount: number;
  avgUpvotes: number;
}

export interface TopContribution {
  answerId: string;
  questionId: string;
  questionTitle: string;
  answerSnippet: string;
  votes: number;
  createdAt: string;
  type: "ai" | "user";
}

export interface PortfolioStats {
  questionsAsked: number;
  answersGiven: number;
  totalUpvotes: number;
  reputationScore: number;
  domains: DomainScore[];
  topContributions: TopContribution[];
  tagline: string;
}

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  "AI & ML": ["ai", "machine", "learning", "neural", "deep learning", "model", "gpt", "llm", "nlp"],
  "Finance": ["invest", "trading", "finance", "stock", "crypto", "market", "portfolio", "economy"],
  "Web Dev": ["web", "react", "code", "programming", "javascript", "typescript", "css", "html", "frontend", "backend", "api"],
  "Health": ["health", "mental", "wellness", "medical", "fitness", "nutrition"],
  "Blockchain": ["blockchain", "crypto", "web3", "decentralized", "ethereum", "bitcoin", "smart contract"],
  "Data Science": ["data", "analytics", "statistics", "visualization", "python", "pandas"],
  "Cybersecurity": ["security", "hack", "encryption", "privacy", "vulnerability", "password"],
  "Design": ["design", "ui", "ux", "figma", "layout", "typography", "color"],
};

function detectDomains(text: string): string[] {
  const lower = text.toLowerCase();
  const matched: string[] = [];
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      matched.push(domain);
    }
  }
  return matched;
}

function scoreToLevel(score: number): DomainScore["level"] {
  if (score >= 80) return "Authority";
  if (score >= 50) return "Expert";
  if (score >= 25) return "Proficient";
  return "Novice";
}

export async function computePortfolio(): Promise<PortfolioStats> {
  const activity = getActivity();

  // Count local activity
  const questionsAsked = activity.filter((a) => a.action === "asked_question").length;
  const answersGiven = activity.filter((a) => a.action === "added_answer").length;
  const upvotesGiven = activity.filter((a) => a.action === "upvoted_answer").length;

  // Fetch actual answer data from DB for top contributions
  // We'll get recent answers and match with questions
  const { data: recentAnswers } = await supabase
    .from("answers")
    .select("id, question_id, content, votes, created_at, type")
    .eq("type", "user")
    .order("votes", { ascending: false })
    .limit(20);

  // Get question titles for those answers
  const questionIds = [...new Set((recentAnswers || []).map((a) => a.question_id))];
  const { data: questions } = questionIds.length > 0
    ? await supabase.from("questions").select("id, title").in("id", questionIds)
    : { data: [] };

  const questionMap = new Map((questions || []).map((q) => [q.id, q.title]));

  // Build top contributions
  const topContributions: TopContribution[] = (recentAnswers || []).slice(0, 5).map((a) => ({
    answerId: a.id,
    questionId: a.question_id,
    questionTitle: questionMap.get(a.question_id) || "Question",
    answerSnippet: a.content.slice(0, 120) + (a.content.length > 120 ? "…" : ""),
    votes: a.votes,
    createdAt: a.created_at,
    type: a.type as "ai" | "user",
  }));

  // Compute total upvotes from activity + DB answers
  const dbUpvotes = (recentAnswers || []).reduce((sum, a) => sum + a.votes, 0);
  const totalUpvotes = dbUpvotes + upvotesGiven;

  // Domain scoring from activity + question titles
  const domainCounts: Record<string, { answers: number; totalVotes: number }> = {};

  // From local activity
  activity.forEach((a) => {
    const text = a.metadata?.title || a.label || "";
    const domains = detectDomains(text);
    domains.forEach((d) => {
      if (!domainCounts[d]) domainCounts[d] = { answers: 0, totalVotes: 0 };
      if (a.action === "added_answer") domainCounts[d].answers++;
      if (a.action === "upvoted_answer") domainCounts[d].totalVotes++;
    });
  });

  // From DB answers
  (recentAnswers || []).forEach((a) => {
    const title = questionMap.get(a.question_id) || "";
    const domains = detectDomains(title + " " + a.content);
    domains.forEach((d) => {
      if (!domainCounts[d]) domainCounts[d] = { answers: 0, totalVotes: 0 };
      domainCounts[d].answers++;
      domainCounts[d].totalVotes += a.votes;
    });
  });

  // Calculate domain scores
  const domains: DomainScore[] = Object.entries(domainCounts)
    .map(([domain, data]) => {
      const avgUpvotes = data.answers > 0 ? data.totalVotes / data.answers : 0;
      const score = Math.min(100, Math.round(
        data.answers * 8 + avgUpvotes * 12
      ));
      return {
        domain,
        score,
        level: scoreToLevel(score),
        answersCount: data.answers,
        avgUpvotes: Math.round(avgUpvotes * 10) / 10,
      };
    })
    .sort((a, b) => b.score - a.score);

  if (domains.length === 0) {
    domains.push({
      domain: "General Knowledge",
      score: 10,
      level: "Novice",
      answersCount: 0,
      avgUpvotes: 0,
    });
  }

  // Reputation formula
  const reputationScore = Math.min(9999,
    questionsAsked * 5 + answersGiven * 10 + totalUpvotes * 2
  );

  // Generate tagline from domains
  const topDomains = domains.slice(0, 3).map((d) => d.domain);
  const tagline = topDomains.length > 0
    ? `Contributor in ${topDomains.join(", ")}`
    : "Building expertise on Pulse";

  return {
    questionsAsked,
    answersGiven,
    totalUpvotes,
    reputationScore,
    domains,
    topContributions,
    tagline,
  };
}
