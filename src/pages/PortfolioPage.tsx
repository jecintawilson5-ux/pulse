import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { getActivity, getSessionId, type ActivityEntry } from "@/lib/activity";
import { fetchStats } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { BarChart2, Star, TrendingUp, MessageSquare, ThumbsUp, Clock, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

function usePortfolioData() {
  const sessionId = getSessionId();
  const activity = getActivity();

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });

  const { data: userAnswers } = useQuery({
    queryKey: ["portfolio-answers", sessionId],
    queryFn: async () => {
      // Count activity-based metrics
      const questionsAsked = activity.filter((a) => a.action === "asked_question").length;
      const answersGiven = activity.filter((a) => a.action === "added_answer").length;
      const upvotes = activity.filter((a) => a.action === "upvoted_answer").length;
      return { questionsAsked, answersGiven, upvotes };
    },
  });

  return { stats, userAnswers, activity };
}

// Derive domains from activity
function deriveDomains(activity: ActivityEntry[]): string[] {
  const domains = new Set<string>();
  activity.forEach((a) => {
    if (a.metadata?.title) {
      const title = a.metadata.title.toLowerCase();
      if (title.includes("ai") || title.includes("machine") || title.includes("learning")) domains.add("AI & ML");
      if (title.includes("invest") || title.includes("trading") || title.includes("finance")) domains.add("Finance");
      if (title.includes("web") || title.includes("react") || title.includes("code") || title.includes("programming")) domains.add("Web Dev");
      if (title.includes("health") || title.includes("mental")) domains.add("Health");
      if (title.includes("blockchain") || title.includes("crypto")) domains.add("Blockchain");
    }
  });
  if (domains.size === 0) domains.add("General Knowledge");
  return Array.from(domains);
}

export default function PortfolioPage() {
  const { stats, userAnswers, activity } = usePortfolioData();
  const domains = deriveDomains(activity);

  const reputationScore = Math.min(
    100 + (userAnswers?.questionsAsked || 0) * 5 + (userAnswers?.answersGiven || 0) * 10 + (userAnswers?.upvotes || 0) * 2,
    9999
  );

  const recentActivity = activity.slice(0, 8);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <BarChart2 className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Your Portfolio</h1>
            <p className="text-sm text-muted-foreground">Auto-generated from your activity on Pulse</p>
          </div>
        </div>

        {/* Reputation Score */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Reputation Score</p>
              <p className="text-4xl font-bold text-primary">{reputationScore}</p>
            </div>
            <Award className="h-12 w-12 text-primary/30" />
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <MessageSquare className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold">{userAnswers?.questionsAsked || 0}</p>
              <p className="text-xs text-muted-foreground">Asked</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold">{userAnswers?.answersGiven || 0}</p>
              <p className="text-xs text-muted-foreground">Answered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ThumbsUp className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold">{userAnswers?.upvotes || 0}</p>
              <p className="text-xs text-muted-foreground">Upvotes</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Domains */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Top Domains
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {domains.map((domain) => (
              <Badge key={domain} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                {domain}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground truncate">{entry.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                Start asking and answering to build your portfolio ✨
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
