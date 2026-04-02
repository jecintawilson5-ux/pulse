import { MessageSquare, ChevronUp, ChevronDown, Clock } from "lucide-react";
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
      className="w-full text-left bg-card border border-border rounded-xl p-[18px] hover:border-border/80 hover:bg-muted/50 transition-all duration-150 hover:-translate-y-px flex gap-4"
    >
      {/* Vote column */}
      <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
        <div className="w-7 h-7 bg-muted border border-border rounded-md flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/10 transition-colors">
          <ChevronUp className="h-3 w-3" />
        </div>
        <span className="text-[13px] font-semibold font-display text-muted-foreground">
          {question.vote_count ?? 0}
        </span>
        <div className="w-7 h-7 bg-muted border border-border rounded-md flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/10 transition-colors">
          <ChevronDown className="h-3 w-3" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-medium text-foreground leading-snug mb-1.5 tracking-[-0.1px]">
          {question.title}
        </h3>
        {question.description && (
          <p className="text-[13px] text-muted-foreground font-light leading-relaxed mb-3 line-clamp-2">
            {question.description}
          </p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Tags — extract from title keywords */}
          <div className="flex gap-1.5 flex-wrap">
            {question.ai_status === "completed" && (
              <span className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded bg-accent2/10 border border-accent2/20 text-accent2">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                AI answered
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <span className="flex items-center gap-1 text-xs text-muted-foreground/50">
              <MessageSquare className="h-3 w-3" />
              {question.answer_count ?? 0}
            </span>
            <span className="text-xs text-muted-foreground/50">
              {timeAgo(question.created_at)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
