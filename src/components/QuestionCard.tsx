import { MessageSquare, ThumbsUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Question } from "@/lib/api";

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

export function QuestionCard({ question }: { question: Question }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/question/${question.id}`)}
      className="w-full text-left rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:bg-card/80 transition-all group"
    >
      <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
        {question.title}
      </h3>
      {question.description && (
        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
          {question.description}
        </p>
      )}
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          {question.answer_count ?? 0}
        </span>
        <span className="flex items-center gap-1">
          <ThumbsUp className="h-3 w-3" />
          {question.vote_count ?? 0}
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <Clock className="h-3 w-3" />
          {timeAgo(question.created_at)}
        </span>
      </div>
    </button>
  );
}
