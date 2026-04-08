import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { AnswerCard } from "@/components/AnswerCard";
import { AddAnswer } from "@/components/AddAnswer";
import { ReportButton } from "@/components/ReportButton";
import { fetchQuestion, fetchAnswers, generateAIAnswer } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Bot, Loader2, Sparkles, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";

const AI_MESSAGES = ["Thinking…", "Analyzing your question…", "Generating answer…"];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

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
    refetchInterval: () => document.hidden ? false : 10000,
  });

  useEffect(() => {
    if (!answers) return;
    const currentCount = answers.length;
    if (prevAnswerCountRef.current > 0 && currentCount > prevAnswerCountRef.current) {
      const diff = currentCount - prevAnswerCountRef.current;
      toast(`🔔 ${diff} new answer${diff > 1 ? "s" : ""} arrived!`, {
        action: { label: "View", onClick: () => document.querySelector("[data-answer-list]")?.scrollIntoView({ behavior: "smooth" }) },
      });
    }
    prevAnswerCountRef.current = currentCount;
  }, [answers]);

  useEffect(() => {
    if (!aiGenerating) { setAiMessageIndex(0); return; }
    const timer = setInterval(() => setAiMessageIndex((i) => Math.min(i + 1, AI_MESSAGES.length - 1)), 1500);
    return () => clearInterval(timer);
  }, [aiGenerating]);

  useEffect(() => {
    if (!question || !answers || aiGenerating || aiFailed) return;
    if (answers.some((a) => a.type === "ai")) return;
    setAiGenerating(true);
    generateAIAnswer(question.id, question.title, question.description || undefined)
      .then((result) => { if (!result) setAiFailed(true); queryClient.invalidateQueries({ queryKey: ["answers", id] }); })
      .catch(() => setAiFailed(true))
      .finally(() => setAiGenerating(false));
  }, [question, answers, id, aiGenerating, aiFailed, queryClient]);

  const handleRetryAI = useCallback(() => {
    if (!question) return;
    setAiFailed(false);
    setAiGenerating(true);
    generateAIAnswer(question.id, question.title, question.description || undefined)
      .then((result) => { if (!result) setAiFailed(true); queryClient.invalidateQueries({ queryKey: ["answers", id] }); })
      .catch(() => setAiFailed(true))
      .finally(() => setAiGenerating(false));
  }, [question, id, queryClient]);

  const sortedAnswers = [...(answers || [])].sort((a, b) => {
    if (a.type === "ai" && b.type !== "ai") return -1;
    if (b.type === "ai" && a.type !== "ai") return 1;
    return b.votes - a.votes;
  });

  return (
    <Layout>
      <div className="max-w-[680px] mx-auto px-4 md:px-8 py-7 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {qLoading ? (
          <Skeleton className="h-24 rounded-2xl" />
        ) : question ? (
          <div className="space-y-3">
            <h1 className="font-display text-2xl font-bold leading-tight tracking-[-0.5px]">{question.title}</h1>
            {question.description && (
              <p className="text-[14px] text-muted-foreground leading-relaxed">{question.description}</p>
            )}
            <div className="flex items-center gap-4 text-[12px] text-muted-foreground/60">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{timeAgo(question.created_at)}</span>
              <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{sortedAnswers.length} answers</span>
              <ReportButton contentId={question.id} contentType="question" />
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Question not found.</p>
        )}

        {/* AI Generating State */}
        {aiGenerating && (
          <div className="flex items-center gap-4 rounded-2xl border border-accent2/30 bg-accent2/5 p-5 animate-in fade-in duration-300">
            <div className="w-10 h-10 rounded-xl bg-accent2/10 flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-accent2 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-accent2" />
                {AI_MESSAGES[aiMessageIndex]}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Pulse AI is analyzing your question</p>
            </div>
          </div>
        )}

        {aiFailed && !sortedAnswers.some((a) => a.type === "ai") && (
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
            <Bot className="h-6 w-6 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">AI took a break. Community answers will appear below.</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleRetryAI} className="rounded-xl">
              Retry
            </Button>
          </div>
        )}

        {/* Answers */}
        <div data-answer-list className="space-y-4">
          {aLoading ? (
            <Skeleton className="h-48 rounded-2xl" />
          ) : (
            <>
              {sortedAnswers.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">
                    {sortedAnswers.length} Answer{sortedAnswers.length !== 1 ? "s" : ""}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
              {sortedAnswers.map((answer) => (
                <div key={answer.id} className="animate-in fade-in duration-300">
                  <AnswerCard answer={answer} questionId={id!} />
                </div>
              ))}
            </>
          )}
        </div>

        {question && <AddAnswer questionId={question.id} />}
      </div>
    </Layout>
  );
}
