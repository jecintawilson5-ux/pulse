import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { QuestionCard } from "@/components/QuestionCard";
import { searchQuestions } from "@/lib/api";
import { logActivity } from "@/lib/activity";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
    if (query.length > 0) logActivity("searched", `Searched: "${query}"`);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) setSearchParams({ q: localQuery.trim() });
  };

  return (
    <Layout>
      <div className="max-w-[680px] mx-auto px-4 md:px-8 py-7 space-y-5">
        <h1 className="font-display text-xl font-bold flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Search
        </h1>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <input
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full bg-card border border-border rounded-2xl py-3.5 pl-12 pr-4 text-[14px] outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)] transition-all placeholder:text-muted-foreground/40"
            autoFocus
          />
        </form>

        {query && (
          <p className="text-sm text-muted-foreground">
            Results for "<span className="text-primary font-semibold">{query}</span>"
          </p>
        )}

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
          ) : results && results.length > 0 ? (
            results.map((q) => <QuestionCard key={q.id} question={q} />)
          ) : query ? (
            <div className="text-center py-16 space-y-4">
              <Search className="h-12 w-12 text-muted-foreground/20 mx-auto" />
              <p className="text-muted-foreground text-sm">No results found for "{query}"</p>
              <Button onClick={() => navigate(`/ask?q=${encodeURIComponent(query)}`)} className="gap-2 rounded-xl">
                <Plus className="h-4 w-4" />
                Ask this question
              </Button>
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Search for questions across Pulse</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
