import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { createAnswer } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function AddAnswer({ questionId }: { questionId: string }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (trimmed.length < 10) {
      toast.error("Answer must be at least 10 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await createAnswer(questionId, trimmed);
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["answers", questionId] });
      toast.success("Answer submitted!");
    } catch {
      toast.error("Failed to submit answer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold mb-2">Your Answer</h3>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your knowledge..."
        rows={4}
        className="resize-none bg-secondary border-none"
      />
      <div className="flex justify-end mt-3">
        <Button type="submit" size="sm" disabled={submitting} className="gap-1.5">
          <Send className="h-3.5 w-3.5" />
          {submitting ? "Submitting..." : "Submit Answer"}
        </Button>
      </div>
    </form>
  );
}
