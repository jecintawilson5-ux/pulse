import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { QuestionCard } from "@/components/QuestionCard";
import { fetchQuestions } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { HelpCircle } from "lucide-react";

export default function UnansweredPage() {
  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions", "newest"],
    queryFn: () => fetchQuestions("newest"),
  });

  const unanswered = questions?.filter((q) => (q.answer_count ?? 0) === 0) || [];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold">Unanswered Questions</h1>
        </div>
        <div className="space-y-3">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
            : unanswered.length > 0
            ? unanswered.map((q) => <QuestionCard key={q.id} question={q} />)
            : <p className="text-center py-12 text-muted-foreground text-sm">All questions have been answered!</p>}
        </div>
      </div>
    </Layout>
  );
}
