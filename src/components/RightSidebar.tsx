import { TrendingUp, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchStats } from "@/lib/api";

const trendingTopics = [
  "Artificial Intelligence",
  "Programming",
  "Machine Learning",
  "Web Development",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "Blockchain",
];

export function RightSidebar() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    refetchInterval: 30000,
  });

  return (
    <aside className="hidden xl:flex w-64 shrink-0 flex-col gap-6 p-4 border-l border-border">
      {/* Trending Topics */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Trending Topics</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {trendingTopics.map((topic) => (
            <Badge key={topic} variant="secondary" className="text-xs cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      {/* Platform Stats */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Platform Stats</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center rounded-lg bg-secondary px-3 py-2">
            <span className="text-xs text-muted-foreground">Questions</span>
            <span className="text-sm font-bold">{stats?.totalQuestions ?? 0}</span>
          </div>
          <div className="flex justify-between items-center rounded-lg bg-secondary px-3 py-2">
            <span className="text-xs text-muted-foreground">Answers</span>
            <span className="text-sm font-bold">{stats?.totalAnswers ?? 0}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
