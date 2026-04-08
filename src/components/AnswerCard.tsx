import { ThumbsUp, User, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportButton } from "@/components/ReportButton";
import { useState, useCallback } from "react";
import { upvoteAnswer, type Answer } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { canVote, recordVote } from "@/lib/rateLimit";
import { logActivity } from "@/lib/activity";
import { toast } from "sonner";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("## ")) return <h3 key={i} className="text-[14px] font-semibold mt-4 mb-1.5 text-foreground">{line.slice(3)}</h3>;
    if (line.startsWith("### ")) return <h4 key={i} className="text-[13px] font-semibold mt-3 mb-1 text-foreground">{line.slice(4)}</h4>;
    if (line.startsWith("- ") || line.startsWith("* ")) return <li key={i} className="text-[13px] ml-4 list-disc text-foreground/90 leading-relaxed">{renderInline(line.slice(2))}</li>;
    if (line.trim() === "") return <div key={i} className="h-2" />;
    return <p key={i} className="text-[13px] leading-relaxed text-foreground/90">{renderInline(line)}</p>;
  });
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i} className="bg-muted px-1.5 py-0.5 rounded text-[12px] font-mono text-primary">{part.slice(1, -1)}</code>;
    return part;
  });
}

export function AnswerCard({ answer, questionId }: { answer: Answer; questionId: string }) {
  const queryClient = useQueryClient();
  const [voting, setVoting] = useState(false);
  const [localVotes, setLocalVotes] = useState(answer.votes);
  const [bouncing, setBouncing] = useState(false);
  const isAI = answer.type === "ai";

  const handleUpvote = useCallback(async () => {
    if (voting) return;
    const check = canVote(answer.id);
    if (!check.allowed) { toast.error(check.message || "Please wait before voting again."); return; }

    setVoting(true);
    setBouncing(true);
    setLocalVotes((v) => v + 1);
    recordVote(answer.id);
    logActivity("upvoted_answer", "Upvoted an answer", { questionId });

    try {
      await upvoteAnswer(answer.id, localVotes);
      queryClient.invalidateQueries({ queryKey: ["answers", questionId] });
    } catch { setLocalVotes((v) => v - 1); }
    finally { setTimeout(() => { setVoting(false); setBouncing(false); }, 500); }
  }, [voting, answer.id, localVotes, questionId, queryClient]);

  return (
    <div className={`rounded-2xl border p-5 transition-all ${isAI ? "border-accent2/30 bg-gradient-to-br from-accent2/5 to-transparent shadow-sm shadow-accent2/5" : "border-border bg-card"}`}>
      <div className="flex items-center gap-2.5 mb-4">
        {isAI ? (
          <>
            <div className="w-7 h-7 rounded-lg bg-accent2/10 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-accent2" />
            </div>
            <span className="text-[12px] font-bold text-accent2">Pulse AI</span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-accent2/10 border border-accent2/20 text-accent2">AI Generated</span>
          </>
        ) : (
          <>
            <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <span className="text-[12px] font-semibold text-muted-foreground">Community</span>
          </>
        )}
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground/50 ml-auto">
          <Clock className="h-3 w-3" />
          {timeAgo(answer.created_at)}
        </span>
      </div>

      <div className="prose-sm">{renderMarkdown(answer.content)}</div>

      <div className="mt-5 pt-4 border-t border-border/50 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUpvote}
          disabled={voting}
          className={`gap-2 text-xs rounded-xl transition-transform ${bouncing ? "scale-110" : "scale-100"} ${localVotes > 0 ? "text-primary" : ""}`}
          aria-label={`Upvote. Current votes: ${localVotes}`}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          {localVotes}
        </Button>
        <ReportButton contentId={answer.id} contentType="answer" />
      </div>
    </div>
  );
}
