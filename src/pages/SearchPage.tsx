import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { QuestionCard } from "@/components/QuestionCard";
import { searchQuestions } from "@/lib/api";
import { logActivity } from "@/lib/activity";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [localQuery, setLocalQuery] = useState(query);

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchQuestions(query),
    enabled: query.length > 0,
  });

  useEffect(() => {
    if (query.length > 0) {
      logActivity("searched", `Searched: "${query}"`);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() });
    }
  };

  return (
    <Layout showSidebars={false}>
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search questions..."
            className="pl-10 bg-secondary border-none h-12 text-base"
            autoFocus
          />
        </form>

        {query && (
          <p className="text-sm text-muted-foreground">
            Results for "<span className="text-primary font-medium">{query}</span>"
          </p>
        )}

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          ) : results && results.length > 0 ? (
            results.map((q) => <QuestionCard key={q.id} question={q} />)
          ) : query ? (
            <div className="text-center py-16 space-y-4">
              <Search className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground text-sm">No results found for "{query}"</p>
              <Button onClick={() => navigate(`/ask?q=${encodeURIComponent(query)}`)} className="gap-1.5">
                <Plus className="h-4 w-4" />
                Ask this question
              </Button>
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Search for questions across Pulse</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
