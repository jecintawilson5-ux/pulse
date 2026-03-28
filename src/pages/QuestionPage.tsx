import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { AnswerCard } from "@/components/AnswerCard";
import { AddAnswer } from "@/components/AddAnswer";
import { fetchQuestion, fetchAnswers, generateAIAnswer } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function QuestionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiFailed, setAiFailed] = useState(false);

  const { data: question, isLoading: qLoading } = useQuery({
    queryKey: ["question", id],
    queryFn: () => fetchQuestion(id!),
    enabled: !!id,
  });

  const { data: answers, isLoading: aLoading } = useQuery({
    queryKey: ["answers", id],
    queryFn: () => fetchAnswers(id!),
    enabled: !!id,
  });

  // Generate AI answer if none exists
  useEffect(() => {
    if (!question || !answers || aiGenerating || aiFailed) return;
    const hasAI = answers.some((a) => a.type === "ai");
    if (hasAI) return;

    setAiGenerating(true);
    generateAIAnswer(question.id, question.title, question.description || undefined)
      .then((result) => {
        if (!result) setAiFailed(true);
        queryClient.invalidateQueries({ queryKey: ["answers", id] });
      })
      .catch(() => setAiFailed(true))
      .finally(() => setAiGenerating(false));
  }, [question, answers, id, aiGenerating, aiFailed, queryClient]);

  // Sort: AI first, then by votes
  const sortedAnswers = [...(answers || [])].sort((a, b) => {
    if (a.type === "ai" && b.type !== "ai") return -1;
    if (b.type === "ai" && a.type !== "ai") return 1;
    return b.votes - a.votes;
  });

  return (
    <Layout showSidebars={false}>
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {qLoading ? (
          <Skeleton className="h-20 rounded-xl" />
        ) : question ? (
          <div>
            <h1 className="text-xl font-bold leading-tight">{question.title}</h1>
            {question.description && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{question.description}</p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">Question not found.</p>
        )}

        {/* AI Generating State */}
        {aiGenerating && (
          <div className="flex items-center gap-3 rounded-xl border border-pulse-ai/30 bg-pulse-ai/5 p-4">
            <Loader2 className="h-5 w-5 text-pulse-ai animate-spin" />
            <div>
              <p className="text-sm font-medium">Generating AI answer...</p>
              <p className="text-xs text-muted-foreground">Pulse AI is analyzing your question</p>
            </div>
          </div>
        )}

        {aiFailed && !sortedAnswers.some((a) => a.type === "ai") && (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <Bot className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">AI answer unavailable. Community answers will appear below.</p>
          </div>
        )}

        {/* Answers */}
        {aLoading ? (
          <Skeleton className="h-40 rounded-xl" />
        ) : (
          <div className="space-y-3">
            {sortedAnswers.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} questionId={id!} />
            ))}
          </div>
        )}

        {/* Add Answer */}
        {question && <AddAnswer questionId={question.id} />}
      </div>
    </Layout>
  );
}
