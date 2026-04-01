import { TrendingUp, BarChart3, Zap, MessageSquare, PlusCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchStats, fetchQuestions } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const trendingTopics = [
  { tag: "Artificial Intelligence", newCount: 12 },
  { tag: "Programming", newCount: 8 },
  { tag: "Machine Learning", newCount: 6 },
  { tag: "Web Development", newCount: 5 },
  { tag: "Data Science", newCount: 4 },
  { tag: "Cybersecurity", newCount: 3 },
  { tag: "Cloud Computing", newCount: 2 },
  { tag: "Blockchain", newCount: 1 },
];

export function RightSidebar() {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    refetchInterval: 30000,
  });

  const { data: activeDiscussions } = useQuery({
    queryKey: ["activeDiscussions"],
    queryFn: () => fetchQuestions("trending", 0, 3),
    refetchInterval: 60000,
  });

  const totalQ = stats?.totalQuestions ?? 0;
  const totalA = stats?.totalAnswers ?? 0;
  const aiPercent = totalQ > 0 ? Math.min(Math.round((totalA / Math.max(totalQ, 1)) * 78), 99) : 0;

  return (
    <aside className="hidden xl:flex w-80 shrink-0 flex-col gap-5 p-4 border-l border-border overflow-y-auto h-screen sticky top-0">
      {/* Quick Ask */}
      <Button
        onClick={() => navigate("/ask")}
        className="w-full gap-2"
        size="lg"
      >
        <PlusCircle className="h-5 w-5" />
        Quick Ask
      </Button>

      {/* Active Discussions */}
      {activeDiscussions?.questions && activeDiscussions.questions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Active Discussions</h3>
          </div>
          <div className="space-y-2">
            {activeDiscussions.questions.map((q) => (
              <button
                key={q.id}
                onClick={() => navigate(`/question/${q.id}`)}
                className="w-full text-left p-2.5 rounded-lg hover:bg-secondary transition-colors group"
              >
                <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {q.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {q.answer_count ?? 0} answers
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(q.created_at), { addSuffix: true })}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Topics */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Trending Topics</h3>
        </div>
        <div className="space-y-1">
          {trendingTopics.slice(0, 6).map((topic) => (
            <button
              key={topic.tag}
              onClick={() => navigate(`/search?q=${encodeURIComponent(topic.tag)}`)}
              className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <span className="text-sm">#{topic.tag}</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {topic.newCount} new
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Expert Spotlight */}
      <div className="rounded-lg bg-secondary/50 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Expert Spotlight</h3>
        </div>
        <div className="flex items-center gap-2.5 mt-2">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            AI
          </div>
          <div>
            <p className="text-sm font-medium">Pulse AI</p>
            <p className="text-xs text-muted-foreground">Multi-domain Expert</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          AI-powered answers across technology, finance, science, and more — always learning, always improving.
        </p>
      </div>

      {/* Community Pulse */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Community Pulse</h3>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-base">🔥</span>
            <span><strong className="text-foreground">{totalA}</strong> answers this week</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">🤖</span>
            <span>AI answered <strong className="text-foreground">{aiPercent}%</strong> of new questions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">📊</span>
            <span><strong className="text-foreground">{totalQ}</strong> questions and growing</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
