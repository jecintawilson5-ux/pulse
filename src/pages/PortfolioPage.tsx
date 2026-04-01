import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { computePortfolio, type PortfolioStats, type DomainScore } from "@/lib/portfolio";
import { getActivity } from "@/lib/activity";
import {
  BarChart2, Star, TrendingUp, MessageSquare, ThumbsUp,
  Clock, Award, Share2, Download, ChevronRight, Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LEVEL_COLORS: Record<string, string> = {
  Novice: "bg-muted text-muted-foreground",
  Proficient: "bg-primary/10 text-primary border-primary/20",
  Expert: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Authority: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

function DomainCard({ domain }: { domain: DomainScore }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-foreground truncate">{domain.domain}</span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${LEVEL_COLORS[domain.level]}`}>
            {domain.level}
          </Badge>
        </div>
        <Progress value={domain.score} className="h-1.5 mb-1" />
        <div className="flex gap-3 text-[11px] text-muted-foreground">
          <span>{domain.answersCount} answers</span>
          <span>~{domain.avgUpvotes} avg votes</span>
        </div>
      </div>
      <span className="text-lg font-bold text-primary tabular-nums">{domain.score}</span>
    </div>
  );
}

export default function PortfolioPage() {
  const navigate = useNavigate();
  const activity = getActivity();

  const { data: portfolio, isLoading } = useQuery<PortfolioStats>({
    queryKey: ["portfolio"],
    queryFn: computePortfolio,
    staleTime: 60_000,
  });

  const recentActivity = activity.slice(0, 8);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Portfolio link copied!");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const handleExport = () => {
    toast.info("PDF export coming soon ✨");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-4">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </Layout>
    );
  }

  const p = portfolio!;
  const nextMilestone = Math.ceil(p.reputationScore / 500) * 500;
  const progressToNext = Math.min(100, (p.reputationScore / nextMilestone) * 100);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
        {/* Header + Identity */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
              <BarChart2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Your Portfolio</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {p.tagline}
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share portfolio">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleExport} aria-label="Export as PDF">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Reputation Score */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Reputation</p>
                <p className="text-4xl font-bold text-primary tabular-nums">{p.reputationScore}</p>
              </div>
              <Award className="h-12 w-12 text-primary/20" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Progress to {nextMilestone}</span>
                <span>{Math.round(progressToNext)}%</span>
              </div>
              <Progress value={progressToNext} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <MessageSquare className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold tabular-nums">{p.questionsAsked}</p>
              <p className="text-xs text-muted-foreground">Asked</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold tabular-nums">{p.answersGiven}</p>
              <p className="text-xs text-muted-foreground">Answered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ThumbsUp className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold tabular-nums">{p.totalUpvotes}</p>
              <p className="text-xs text-muted-foreground">Upvotes</p>
            </CardContent>
          </Card>
        </div>

        {/* Domain Expertise */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Domain Expertise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {p.domains.map((d) => (
              <DomainCard key={d.domain} domain={d} />
            ))}
          </CardContent>
        </Card>

        {/* Top Contributions */}
        {p.topContributions.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                Top Contributions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {p.topContributions.map((c) => (
                <button
                  key={c.answerId}
                  onClick={() => navigate(`/question/${c.questionId}`)}
                  className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {c.questionTitle}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{c.answerSnippet}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <ThumbsUp className="h-3 w-3" />
                      <span className="tabular-nums">{c.votes}</span>
                      <ChevronRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

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
