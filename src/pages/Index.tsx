import { useState, useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { AskBox } from "@/components/AskBox";
import { QuestionCard } from "@/components/QuestionCard";
import { fetchQuestions } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, HelpCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PulseLogo } from "@/components/PulseLogo";
import bgNodes from "@/assets/logo-v2-nodes-wave.png";

const tabs = [
  { key: "newest" as const, label: "For You", icon: Sparkles },
  { key: "trending" as const, label: "Trending", icon: TrendingUp },
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

  // Infinite scroll observer
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
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] z-0">
        <img src={bgNodes} alt="" className="w-full h-full object-cover" aria-hidden="true" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto p-4 md:p-6 space-y-5">
        {/* Hero */}
        <div className="flex flex-col items-center text-center py-6 space-y-3">
          <img src={heroBrain} alt="Pulse AI" className="h-12 w-auto animate-pulse" />
          <h1 className="text-2xl font-bold tracking-tight">Ask anything. Get intelligent answers.</h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Pulse combines AI with community knowledge to deliver fast, reliable insights.
          </p>
        </div>

        <AskBox />

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium transition-colors relative flex items-center gap-1.5",
                activeTab === tab.key
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          ) : allQuestions.length > 0 ? (
            <>
              {allQuestions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
              {/* Infinite scroll sentinel */}
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
