import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { AskBox } from "@/components/AskBox";
import { QuestionCard } from "@/components/QuestionCard";
import { fetchQuestions } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
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
