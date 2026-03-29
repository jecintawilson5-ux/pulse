import { ThumbsUp, User, Clock } from "lucide-react";
import speechIcon from "@/assets/logo-v4-speech-pulse.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useCallback } from "react";
import { upvoteAnswer, type Answer } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Simple markdown-to-JSX: handles **bold**, ## headings, - bullets, `code`
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("## ")) {
      return <h3 key={i} className="text-sm font-semibold mt-3 mb-1">{line.slice(3)}</h3>;
    }
    if (line.startsWith("### ")) {
      return <h4 key={i} className="text-xs font-semibold mt-2 mb-1">{line.slice(4)}</h4>;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return <li key={i} className="text-sm ml-4 list-disc">{renderInline(line.slice(2))}</li>;
    }
    if (line.trim() === "") return <br key={i} />;
    return <p key={i} className="text-sm leading-relaxed">{renderInline(line)}</p>;
  });
}

function renderInline(text: string) {
  // Handle **bold** and `code`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="bg-secondary px-1 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    return part;
  });
}

export function AnswerCard({ answer, questionId }: { answer: Answer; questionId: string }) {
  const queryClient = useQueryClient();
  const [voting, setVoting] = useState(false);
  const [localVotes, setLocalVotes] = useState(answer.votes);
  const isAI = answer.type === "ai";

  const handleUpvote = useCallback(async () => {
    if (voting) return;
    setVoting(true);
    setLocalVotes((v) => v + 1);
    try {
      await upvoteAnswer(answer.id, localVotes);
      queryClient.invalidateQueries({ queryKey: ["answers", questionId] });
    } catch {
      setLocalVotes((v) => v - 1);
    } finally {
      setTimeout(() => setVoting(false), 500); // debounce
    }
  }, [voting, answer.id, localVotes, questionId, queryClient]);

  return (
    <div className={`rounded-xl border p-4 ${isAI ? "border-pulse-ai/30 bg-pulse-ai/5 ai-glow" : "border-border bg-card"}`}>
      <div className="flex items-center gap-2 mb-3">
        {isAI ? (
          <>
            <Bot className="h-4 w-4 text-pulse-ai" />
            <Badge className="bg-pulse-ai text-pulse-ai-foreground text-xs border-none">Pulse AI</Badge>
          </>
        ) : (
          <>
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Community Answer</span>
          </>
        )}
        <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
          <Clock className="h-3 w-3" />
          {timeAgo(answer.created_at)}
        </span>
      </div>

      <div className="prose-sm">{renderMarkdown(answer.content)}</div>

      <div className="mt-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUpvote}
          disabled={voting}
          className="gap-1.5 text-xs"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          {localVotes}
        </Button>
      </div>
    </div>
  );
}
