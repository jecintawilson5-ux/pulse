import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { createQuestion } from "@/lib/api";
import { checkProfanity } from "@/lib/profanity";
import { logActivity } from "@/lib/activity";
import { enqueueAction } from "@/lib/offlineQueue";
import { toast } from "sonner";
import { Send, Sparkles, AlertTriangle } from "lucide-react";

export default function AskPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState(searchParams.get("q") || "");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [profanityWarning, setProfanityWarning] = useState("");
  const [images, setImages] = useState<{ url: string; path: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim().replace(/<[^>]*>/g, "");

    if (trimmedTitle.length < 10) {
      toast.error("Title must be at least 10 characters.");
      return;
    }

    const titleCheck = checkProfanity(trimmedTitle);
    const descCheck = checkProfanity(description);

    if (titleCheck.severity === "severe" || descCheck.severity === "severe") {
      toast.error("Your question contains inappropriate language. Please rephrase.");
      return;
    }

    if (titleCheck.severity === "mild" || descCheck.severity === "mild") {
      setProfanityWarning("Your question may contain strong language. It will still be posted.");
    }

    setSubmitting(true);

    // Handle offline
    if (!navigator.onLine) {
      enqueueAction("QUESTION", { title: trimmedTitle, description: description.trim() || null });
      toast.info("You're offline. Your question will be posted when you're back online.");
      navigate("/");
      return;
    }

    try {
      const question = await createQuestion(
        trimmedTitle,
        description.trim().replace(/<[^>]*>/g, "") || undefined
      );
      logActivity("asked_question", trimmedTitle, { questionId: question.id });
      toast.success("Question posted!");
      navigate(`/question/${question.id}`);
    } catch {
      toast.error("Failed to post question.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout showSidebars={false}>
      <div className="max-w-xl mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold">Ask a Question</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setProfanityWarning(""); }}
              placeholder="e.g. How does backpropagation work in neural networks?"
              className="bg-secondary border-none"
              maxLength={200}
              autoFocus
              aria-label="Question title"
            />
            <p className="text-xs text-muted-foreground mt-1">{title.length}/200 characters (min 10)</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Description (optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more context to help AI and the community give better answers..."
              rows={5}
              className="resize-none bg-secondary border-none"
              maxLength={2000}
              aria-label="Question description"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Images (optional)</label>
            <ImageUpload images={images} onImagesChange={setImages} maxImages={3} />
            <p className="text-xs text-muted-foreground mt-1">Max 3 images, 1MB each after compression</p>
          </div>

          {profanityWarning && (
            <div className="flex items-center gap-2 text-sm text-badge rounded-lg bg-badge/10 p-3">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {profanityWarning}
            </div>
          )}

          <Button type="submit" disabled={submitting} className="w-full gap-1.5">
            <Send className="h-4 w-4" />
            {submitting ? "Posting..." : "Post Question & Get AI Answer"}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
