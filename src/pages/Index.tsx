import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { AskBox } from "@/components/AskBox";
import { QuestionCard } from "@/components/QuestionCard";
import { fetchQuestions } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import heroBrain from "@/assets/logo-v1-brain-pulse.png";
import bgNodes from "@/assets/logo-v2-nodes-wave.png";

const tabs = ["For You", "Trending", "Newest"] as const;

export default function Index() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("For You");

  const sortBy = activeTab === "Trending" ? "trending" : "newest";
  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions", sortBy],
    queryFn: () => fetchQuestions(sortBy as "newest" | "trending"),
    refetchInterval: 15000,
  });

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
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium transition-colors relative",
                activeTab === tab
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="space-y-3">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))
            : questions && questions.length > 0
            ? questions.map((q) => <QuestionCard key={q.id} question={q} />)
            : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">No questions yet. Be the first to ask!</p>
              </div>
            )}
        </div>
      </div>
    </Layout>
  );
}
