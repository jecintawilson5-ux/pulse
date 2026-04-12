import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MessageSquare, Flame, ArrowRight, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchStats } from "@/lib/api";

const trendingTopics = [
  { tag: "AI", count: 12 },
  { tag: "Programming", count: 8 },
  { tag: "ML", count: 6 },
  { tag: "Web Dev", count: 5 },
  { tag: "Data Science", count: 4 },
  { tag: "Crypto", count: 3 },
];

export function RightSidebar() {
  const navigate = useNavigate();
  const [quickQ, setQuickQ] = useState("");

  const { data: discussions } = useQuery({
    queryKey: ["active-discussions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("questions")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(4);
      return data ?? [];
    },
    refetchInterval: 300000,
  });

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    refetchInterval: 300000,
  });

  const handleQuickAsk = () => {
    if (quickQ.trim()) {
      navigate(`/ask?q=${encodeURIComponent(quickQ.trim())}`);
      setQuickQ("");
    }
  };

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  return (
    <aside className="hidden lg:block w-80 shrink-0 sticky top-0 h-screen overflow-y-auto border-l border-border bg-sidebar p-5">
      {/* Quick Ask */}
      <div className="relative bg-gradient-to-br from-primary/10 to-accent2/10 border border-primary/20 rounded-2xl p-4 mb-6 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent2 to-primary" />
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold font-display text-primary tracking-wide uppercase">Quick Ask</span>
        </div>
        <input
          value={quickQ}
          onChange={(e) => setQuickQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleQuickAsk()}
          placeholder="What do you want to know?"
          className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)] transition-all mb-2.5"
        />
        <button
          onClick={handleQuickAsk}
          className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          Get AI Answer
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Active Discussions */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="h-3.5 w-3.5 text-accent2" />
          <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground/50 font-display">Active Discussions</span>
        </div>
        <div className="space-y-0">
          {discussions?.map((q) => (
            <button
              key={q.id}
              onClick={() => navigate(`/question/${q.id}`)}
              className="w-full text-left py-3 border-b border-border/50 last:border-b-0 hover:opacity-70 transition-opacity group"
            >
              <div className="text-[13px] text-foreground leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                {q.title}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground/50">
                <span className="flex items-center gap-1 text-accent2">
                  <MessageSquare className="h-[11px] w-[11px]" />
                  Discuss
                </span>
                <span>{timeAgo(q.created_at)}</span>
              </div>
            </button>
          ))}
          {(!discussions || discussions.length === 0) && (
            <p className="text-xs text-muted-foreground/40 py-3">No discussions yet.</p>
          )}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="mb-6">
        <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground/50 font-display mb-3">
          Trending Topics
        </div>
        <div className="flex flex-wrap gap-1.5">
          {trendingTopics.map((t) => (
            <button
              key={t.tag}
              onClick={() => navigate(`/search?q=${t.tag}`)}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/20 transition-all"
            >
              #{t.tag}
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-1 py-px rounded">
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Expert Spotlight */}
      <div className="mb-6">
        <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground/50 font-display mb-3">
          Expert Spotlight
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent2 flex items-center justify-center text-sm font-bold text-white shrink-0">
              PA
            </div>
            <div>
              <div className="text-[13px] font-semibold text-foreground">Cognara AI</div>
              <div className="text-[11px] text-muted-foreground">Multi-Domain Expert</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-light leading-relaxed mb-3">
            AI-powered answers across technology, finance, science, and more — always learning.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary">Tech</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-accent2/10 border border-accent2/20 text-accent2">Finance</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted border border-border text-muted-foreground">Science</span>
          </div>
        </div>
      </div>

      {/* Community Pulse */}
      <div className="border-t border-border pt-4">
        <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground/50 font-display mb-3">
           Community Stats
        </div>
        <div className="space-y-2 text-[12px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent2 animate-pulse" />
            <span><strong className="text-foreground">{stats?.totalAnswers ?? 0}</strong> answers contributed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span><strong className="text-foreground">{stats?.totalQuestions ?? 0}</strong> questions and growing</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
