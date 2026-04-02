import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { AskBox } from "@/components/AskBox";
import { QuestionCard } from "@/components/QuestionCard";
import { fetchQuestions } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, HelpCircle, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tabs = [
  { key: "newest" as const, label: "For You" },
  { key: "trending" as const, label: "Trending" },
] as const;

const suggestedPrompts = [
  "How does machine learning differ from traditional programming?",
  "What are the best investment strategies for 2025?",
  "How do I get started with web development?",
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<"newest" | "trending">("newest");
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["questions", activeTab],
    queryFn: ({ pageParam = 0 }) => fetchQuestions(activeTab, pageParam, 10),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length : undefined,
    initialPageParam: 0,
    refetchInterval: 15000,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );
    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allQuestions = data?.pages.flatMap((p) => p.questions) ?? [];

  return (
    <Layout>
      <div className="max-w-[680px] mx-auto px-4 md:px-8 py-7">
        {/* Hero */}
        <div className="text-center py-8 relative animate-fade-up">
          {/* Glow */}
          <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-[300px] h-[160px] bg-[radial-gradient(ellipse,hsl(var(--primary)/0.1)_0%,transparent_70%)] pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-[11.5px] font-medium px-3 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            AI-Powered Answers
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-[-1.5px] leading-[1.1] mb-2.5 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            Ask anything.<br />Get intelligent answers.
          </h1>
          <p className="text-muted-foreground text-[15px] font-light max-w-[460px] mx-auto leading-relaxed mb-7">
            Pulse blends AI with community knowledge to surface fast, reliable insights — on any topic.
          </p>
        </div>

        <AskBox />

        {/* Feed header */}
        <div className="flex items-center justify-between mt-9 mb-4 animate-fade-up-delay-2">
          <div className="flex gap-0.5 bg-card border border-border rounded-lg p-[3px]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-[13px] transition-all",
                  activeTab === tab.key
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate("/ask")}
            className="flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-3.5 w-3.5" />
            Ask Question
          </button>
        </div>

        {/* Feed */}
        <div className="space-y-2.5 animate-fade-up-delay-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          ) : allQuestions.length > 0 ? (
            <>
              {allQuestions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
              <div ref={loadMoreRef} className="py-4 text-center">
                {isFetchingNextPage ? (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading more...</span>
                  </div>
                ) : !hasNextPage ? (
                  <p className="text-xs text-muted-foreground">You've seen it all 🎉</p>
                ) : null}
              </div>
            </>
          ) : (
            <div className="text-center py-12 space-y-5">
              <div className="space-y-2">
                <HelpCircle className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                <p className="text-sm text-muted-foreground">No questions yet 👀</p>
                <p className="text-xs text-muted-foreground">Be the first to ask!</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Try asking:</p>
                {suggestedPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left text-xs h-auto py-2.5 px-3"
                    onClick={() => navigate(`/ask?q=${encodeURIComponent(prompt)}`)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
