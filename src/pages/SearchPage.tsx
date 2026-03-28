import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { QuestionCard } from "@/components/QuestionCard";
import { searchQuestions } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchQuestions(query),
    enabled: query.length > 0,
  });

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-lg font-bold">
            Results for "<span className="text-primary">{query}</span>"
          </h1>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          ) : results && results.length > 0 ? (
            results.map((q) => <QuestionCard key={q.id} question={q} />)
          ) : (
            <div className="text-center py-16 space-y-4">
              <p className="text-muted-foreground">No results found for "{query}"</p>
              <Button onClick={() => navigate("/ask")} className="gap-1.5">
                <Plus className="h-4 w-4" />
                Ask this question
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
