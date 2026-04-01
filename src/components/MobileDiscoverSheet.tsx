import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchStats, fetchQuestions } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const trendingTopics = [
  { tag: "Artificial Intelligence", newCount: 12 },
  { tag: "Programming", newCount: 8 },
  { tag: "Machine Learning", newCount: 6 },
  { tag: "Web Development", newCount: 5 },
  { tag: "Data Science", newCount: 4 },
];

export function MobileDiscoverSheet() {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });

  const { data: activeDiscussions } = useQuery({
    queryKey: ["activeDiscussions"],
    queryFn: () => fetchQuestions("trending", 0, 3),
  });

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="lg:hidden fixed bottom-20 right-4 z-40 h-12 w-12 rounded-full shadow-lg shadow-primary/30"
        >
          <Compass className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Discover</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Active Discussions */}
          {activeDiscussions?.questions && activeDiscussions.questions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">🔥 Active Discussions</h3>
              <div className="space-y-2">
                {activeDiscussions.questions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => navigate(`/question/${q.id}`)}
                    className="w-full text-left p-2.5 rounded-lg bg-secondary/50"
                  >
                    <p className="text-sm font-medium line-clamp-2">{q.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {q.answer_count ?? 0} answers
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Topics */}
          <div>
            <h3 className="text-sm font-semibold mb-2">📈 Trending Topics</h3>
            <div className="flex flex-wrap gap-1.5">
              {trendingTopics.map((topic) => (
                <Badge
                  key={topic.tag}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(topic.tag)}`)}
                >
                  #{topic.tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Community Pulse */}
          <div className="text-xs text-muted-foreground space-y-1.5 border-t border-border pt-3">
            <p>🔥 <strong className="text-foreground">{stats?.totalAnswers ?? 0}</strong> answers this week</p>
            <p>📊 <strong className="text-foreground">{stats?.totalQuestions ?? 0}</strong> questions and growing</p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
