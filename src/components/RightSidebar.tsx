import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const trendingTopics = [
  { tag: "ArtificialIntelligence", count: 12 },
  { tag: "Programming", count: 8 },
  { tag: "MachineLearning", count: 6 },
  { tag: "WebDevelopment", count: 5 },
  { tag: "DataScience", count: 4 },
  { tag: "Cybersecurity", count: 3 },
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
        .limit(3);
      return data ?? [];
    },
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
    <aside className="hidden lg:block w-[280px] shrink-0 sticky top-0 h-screen overflow-y-auto border-l border-border bg-sidebar p-4">
      {/* Quick Ask */}
      <div className="relative bg-muted border border-border rounded-xl p-3.5 mb-6 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent2" />
        <div className="text-xs font-semibold text-primary font-display mb-2">Quick Ask</div>
        <input
          value={quickQ}
          onChange={(e) => setQuickQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleQuickAsk()}
          placeholder="Ask anything fast..."
          className="w-full bg-background border border-border rounded-lg px-2.5 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/40 transition-colors mb-2"
        />
        <button
          onClick={handleQuickAsk}
          className="w-full bg-primary text-primary-foreground rounded-lg py-2 text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          Get AI Answer →
        </button>
      </div>

      {/* Active Discussions */}
      <div className="mb-6">
        <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground/50 font-display mb-3">
          Active Discussions
        </div>
        <div className="space-y-0">
          {discussions?.map((q) => (
            <button
              key={q.id}
              onClick={() => navigate(`/question/${q.id}`)}
              className="w-full text-left py-2.5 border-b border-border last:border-b-0 hover:opacity-75 transition-opacity"
            >
              <div className="text-[13px] text-foreground leading-snug mb-1 line-clamp-2">
                {q.title}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground/50">
                <span className="flex items-center gap-1 text-accent2">
                  <MessageSquare className="h-[11px] w-[11px]" />1
                </span>
                <span>{timeAgo(q.created_at)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="mb-6">
        <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground/50 font-display mb-3">
          Trending Topics
        </div>
        <div className="space-y-0.5">
          {trendingTopics.map((t) => (
            <button
              key={t.tag}
              onClick={() => navigate(`/search?q=${t.tag}`)}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <span className="text-[13px] text-foreground">#{t.tag}</span>
              <span className="text-[11px] font-semibold font-display text-primary bg-primary/10 px-1.5 py-px rounded">
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Expert Spotlight */}
      <div>
        <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground/50 font-display mb-3">
          Expert Spotlight
        </div>
        <div className="bg-muted border border-border rounded-xl p-3.5">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent2 flex items-center justify-center text-xs font-bold text-white shrink-0">
              PA
            </div>
            <div>
              <div className="text-[13px] font-medium text-foreground">Pulse AI</div>
              <div className="text-[11px] text-muted-foreground">Multi-Domain Expert</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-light leading-relaxed mb-2.5">
            AI-powered answers across technology, finance, science, and more — always available, always learning.
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">Tech</span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-accent2/10 border border-accent2/20 text-accent2">Finance</span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-muted border border-border text-muted-foreground">Science</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
