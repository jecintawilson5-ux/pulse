import { MessageSquare, ChevronUp, Sparkles, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Question } from "@/lib/api";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function QuestionCard({ question }: { question: Question }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/question/${question.id}`)}
      className="w-full text-left bg-card border border-border rounded-2xl p-5 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 hover:-translate-y-0.5 flex gap-4 group"
    >
      {/* Vote column */}
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <div className="w-8 h-8 bg-muted border border-border rounded-lg flex items-center justify-center text-muted-foreground group-hover:border-primary/30 group-hover:text-primary transition-colors">
          <ChevronUp className="h-4 w-4" />
        </div>
        <span className="text-[13px] font-bold font-display text-foreground tabular-nums">
          {question.vote_count ?? 0}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-semibold text-foreground leading-snug mb-1 tracking-[-0.2px] group-hover:text-primary transition-colors">
          {question.title}
        </h3>
        {question.description && (
          <p className="text-[13px] text-muted-foreground font-light leading-relaxed mb-3 line-clamp-2">
            {question.description}
          </p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          {question.ai_status === "completed" && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-lg bg-accent2/10 border border-accent2/20 text-accent2">
              <Sparkles className="h-3 w-3" />
              AI Answered
            </span>
          )}
          {question.ai_status === "pending" && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary animate-pulse">
              <Sparkles className="h-3 w-3" />
              AI Processing
            </span>
          )}

          <div className="flex items-center gap-3 ml-auto text-muted-foreground/60">
            <span className="flex items-center gap-1 text-[12px]">
              <MessageSquare className="h-3.5 w-3.5" />
              {question.answer_count ?? 0}
            </span>
            <span className="flex items-center gap-1 text-[12px]">
              <Clock className="h-3.5 w-3.5" />
              {timeAgo(question.created_at)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
