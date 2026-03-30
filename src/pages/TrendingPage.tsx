import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { QuestionCard } from "@/components/QuestionCard";
import { fetchAllQuestions } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

export default function TrendingPage() {
  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions-all", "trending"],
    queryFn: () => fetchAllQuestions("trending"),
  });

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold">Trending Questions</h1>
        </div>
        <div className="space-y-3">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
            : questions && questions.length > 0
            ? questions.map((q) => <QuestionCard key={q.id} question={q} />)
            : <p className="text-center py-12 text-muted-foreground text-sm">No trending questions yet.</p>}
        </div>
      </div>
    </Layout>
  );
}
