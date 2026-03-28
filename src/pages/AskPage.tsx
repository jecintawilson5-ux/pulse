import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createQuestion } from "@/lib/api";
import { toast } from "sonner";
import { Send, Sparkles } from "lucide-react";

export default function AskPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim().replace(/<[^>]*>/g, ""); // sanitize

    if (trimmedTitle.length < 10) {
      toast.error("Title must be at least 10 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const question = await createQuestion(
        trimmedTitle,
        description.trim().replace(/<[^>]*>/g, "") || undefined
      );
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
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How does backpropagation work in neural networks?"
              className="bg-secondary border-none"
              maxLength={200}
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
            />
          </div>

          <Button type="submit" disabled={submitting} className="w-full gap-1.5">
            <Send className="h-4 w-4" />
            {submitting ? "Posting..." : "Post Question & Get AI Answer"}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
