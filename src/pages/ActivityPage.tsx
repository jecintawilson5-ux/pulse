import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { getActivity, clearActivity, type ActivityEntry } from "@/lib/activity";
import { Activity, Trash2, MessageSquare, ThumbsUp, HelpCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const iconMap: Record<string, typeof Activity> = {
  asked_question: HelpCircle,
  submitted_answer: MessageSquare,
  upvoted_answer: ThumbsUp,
  searched: Search,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ActivityPage() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => { setEntries(getActivity()); }, []);

  const handleClear = () => { clearActivity(); setEntries([]); };

  return (
    <Layout>
      <div className="max-w-[680px] mx-auto px-4 md:px-8 py-7 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">Activity</h1>
              <p className="text-xs text-muted-foreground">Your recent interactions</p>
            </div>
          </div>
          {entries.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground gap-2 rounded-xl">
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Activity className="h-12 w-12 text-muted-foreground/20 mx-auto" />
            <p className="text-sm font-medium text-muted-foreground">Your activity will appear here.</p>
            <p className="text-xs text-muted-foreground/60">Ask questions, vote on answers, and search to build your history.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.slice(0, 30).map((entry) => {
              const Icon = iconMap[entry.action] || Activity;
              return (
                <button
                  key={entry.id}
                  onClick={() => { if (entry.metadata?.questionId) navigate(`/question/${entry.metadata.questionId}`); }}
                  className="w-full text-left flex items-start gap-3 rounded-2xl border border-border bg-card p-4 hover:border-primary/20 hover:shadow-sm transition-all"
                >
                  <div className="mt-0.5 p-2 rounded-xl bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.label}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">{timeAgo(entry.timestamp)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
