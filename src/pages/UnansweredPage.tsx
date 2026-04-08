import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { QuestionCard } from "@/components/QuestionCard";
import { fetchAllQuestions } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { HelpCircle } from "lucide-react";

export default function UnansweredPage() {
  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions-all", "newest"],
    queryFn: () => fetchAllQuestions("newest"),
  });

  const unanswered = questions?.filter((q) => (q.answer_count ?? 0) === 0) || [];

  return (
    <Layout>
      <div className="max-w-[680px] mx-auto px-4 md:px-8 py-7 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">Unanswered</h1>
            <p className="text-xs text-muted-foreground">Questions waiting for community input</p>
          </div>
        </div>
        <div className="space-y-3">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
            : unanswered.length > 0
            ? unanswered.map((q) => <QuestionCard key={q.id} question={q} />)
            : <p className="text-center py-16 text-muted-foreground text-sm">All questions have been answered! 🎉</p>}
        </div>
      </div>
    </Layout>
  );
}
