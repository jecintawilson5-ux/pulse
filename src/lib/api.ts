import { supabase } from "@/integrations/supabase/client";

export interface Question {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  ai_status?: string;
  answer_count?: number;
  vote_count?: number;
}

export interface Answer {
  id: string;
  question_id: string;
  content: string;
  type: "ai" | "user";
  votes: number;
  created_at: string;
}

// Questions with pagination
export async function fetchQuestions(
  sortBy: "newest" | "trending" = "newest",
  page = 0,
  limit = 10
): Promise<{ questions: Question[]; hasMore: boolean }> {
  const from = page * limit;
  const to = from + limit - 1;

  const { data: questions, error } = await supabase
    .from("questions")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to + 1); // fetch one extra to check hasMore

  if (error) throw error;

  const items = questions || [];
  const hasMore = items.length > limit;
  const pageItems = hasMore ? items.slice(0, limit) : items;

  // Enrich with counts
  const enriched = await Promise.all(
    pageItems.map(async (q) => {
      const { count } = await supabase
        .from("answers")
        .select("*", { count: "exact", head: true })
        .eq("question_id", q.id);

      const { data: answers } = await supabase
        .from("answers")
        .select("votes")
        .eq("question_id", q.id);

      const voteCount = (answers || []).reduce((sum, a) => sum + (a.votes || 0), 0);
      return { ...q, answer_count: count || 0, vote_count: voteCount };
    })
  );

  if (sortBy === "trending") {
    enriched.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
  }

  return { questions: enriched, hasMore };
}

// Legacy compat
export async function fetchAllQuestions(sortBy: "newest" | "trending" = "newest"): Promise<Question[]> {
  const { questions } = await fetchQuestions(sortBy, 0, 100);
  return questions;
}

export async function fetchQuestion(id: string): Promise<Question | null> {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createQuestion(title: string, description?: string): Promise<Question> {
  const { data, error } = await supabase
    .from("questions")
    .insert({ title, description: description || null })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function searchQuestions(query: string): Promise<Question[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Answers
export async function fetchAnswers(questionId: string): Promise<Answer[]> {
  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("question_id", questionId)
    .order("type", { ascending: true })
    .order("votes", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createAnswer(questionId: string, content: string): Promise<Answer> {
  const { data, error } = await supabase
    .from("answers")
    .insert({ question_id: questionId, content, type: "user" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function upvoteAnswer(answerId: string, currentVotes: number): Promise<void> {
  const { error } = await supabase
    .from("answers")
    .update({ votes: currentVotes + 1 })
    .eq("id", answerId);

  if (error) throw error;
}

// AI Answer Generation
export async function generateAIAnswer(questionId: string, title: string, description?: string): Promise<Answer | null> {
  const { data, error } = await supabase.functions.invoke("generate-answer", {
    body: { questionId, title, description },
  });

  if (error) {
    console.error("[API] generate-answer error:", error);
    return null;
  }

  if (data?.failed) return null;
  return data?.answer || null;
}

// Stats
export async function fetchStats(): Promise<{ totalQuestions: number; totalAnswers: number }> {
  const { count: totalQuestions } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true });

  const { count: totalAnswers } = await supabase
    .from("answers")
    .select("*", { count: "exact", head: true });

  return {
    totalQuestions: totalQuestions || 0,
    totalAnswers: totalAnswers || 0,
  };
}
