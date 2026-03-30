import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { AnswerCard } from "@/components/AnswerCard";
import { AddAnswer } from "@/components/AddAnswer";
import { ReportButton } from "@/components/ReportButton";
import { fetchQuestion, fetchAnswers, generateAIAnswer } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";

const AI_MESSAGES = ["Thinking…", "Analyzing your question…", "Generating answer…"];

export default function QuestionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiFailed, setAiFailed] = useState(false);
  const [aiMessageIndex, setAiMessageIndex] = useState(0);
  const prevAnswerCountRef = useRef(0);

  const { data: question, isLoading: qLoading } = useQuery({
    queryKey: ["question", id],
    queryFn: () => fetchQuestion(id!),
    enabled: !!id,
  });

  const { data: answers, isLoading: aLoading } = useQuery({
    queryKey: ["answers", id],
    queryFn: () => fetchAnswers(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      // Poll every 10s only when page is visible
      if (document.hidden) return false;
      return 10000;
    },
  });

  // Toast when new answers arrive via polling
  useEffect(() => {
    if (!answers) return;
    const currentCount = answers.length;
    if (prevAnswerCountRef.current > 0 && currentCount > prevAnswerCountRef.current) {
      const diff = currentCount - prevAnswerCountRef.current;
      toast(`🔔 ${diff} new answer${diff > 1 ? "s" : ""} arrived!`, {
        action: {
          label: "View",
          onClick: () => {
            document.querySelector("[data-answer-list]")?.scrollIntoView({ behavior: "smooth" });
          },
        },
      });
    }
    prevAnswerCountRef.current = currentCount;
  }, [answers]);

  // AI progress messages
  useEffect(() => {
    if (!aiGenerating) { setAiMessageIndex(0); return; }
    const timer = setInterval(() => {
      setAiMessageIndex((i) => Math.min(i + 1, AI_MESSAGES.length - 1));
    }, 1500);
    return () => clearInterval(timer);
  }, [aiGenerating]);

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

  const handleRetryAI = useCallback(() => {
    if (!question) return;
    setAiFailed(false);
    setAiGenerating(true);
    generateAIAnswer(question.id, question.title, question.description || undefined)
      .then((result) => {
        if (!result) setAiFailed(true);
        queryClient.invalidateQueries({ queryKey: ["answers", id] });
      })
      .catch(() => setAiFailed(true))
      .finally(() => setAiGenerating(false));
  }, [question, id, queryClient]);

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
            <div className="mt-2">
              <ReportButton contentId={question.id} contentType="question" />
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Question not found.</p>
        )}

        {/* AI Generating State */}
        {aiGenerating && (
          <div className="flex items-center gap-3 rounded-xl border border-pulse-ai/30 bg-pulse-ai/5 p-4 animate-in fade-in duration-300">
            <Loader2 className="h-5 w-5 text-pulse-ai animate-spin" />
            <div>
              <p className="text-sm font-medium">{AI_MESSAGES[aiMessageIndex]}</p>
              <p className="text-xs text-muted-foreground">Pulse AI is analyzing your question</p>
            </div>
          </div>
        )}

        {aiFailed && !sortedAnswers.some((a) => a.type === "ai") && (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <Bot className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">AI took a break. Community answers will appear below.</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleRetryAI}>
              Retry
            </Button>
          </div>
        )}

        {/* Answers */}
        <div data-answer-list>
          {aLoading ? (
            <Skeleton className="h-40 rounded-xl" />
          ) : (
            <div className="space-y-3">
              {sortedAnswers.length > 0 && (
                <p className="text-xs font-medium text-muted-foreground">
                  {sortedAnswers.length} answer{sortedAnswers.length !== 1 ? "s" : ""}
                </p>
              )}
              {sortedAnswers.map((answer) => (
                <div key={answer.id} className="animate-in fade-in duration-300">
                  <AnswerCard answer={answer} questionId={id!} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Answer */}
        {question && <AddAnswer questionId={question.id} />}
      </div>
    </Layout>
  );
}
