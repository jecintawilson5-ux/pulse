import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { Send } from "lucide-react";
import { createAnswer } from "@/lib/api";
import { checkProfanity } from "@/lib/profanity";
import { logActivity } from "@/lib/activity";
import { enqueueAction } from "@/lib/offlineQueue";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function AddAnswer({ questionId }: { questionId: string }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<{ url: string; path: string }[]>([]);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (trimmed.length < 10) { toast.error("Answer must be at least 10 characters."); return; }

    const check = checkProfanity(trimmed);
    if (check.severity === "severe") { toast.error("Your answer contains inappropriate language. Please rephrase."); return; }

    if (!navigator.onLine) {
      enqueueAction("ANSWER", { questionId, content: trimmed });
      toast.info("You're offline. Your answer will be submitted when you're back online.");
      setContent(""); setImages([]); return;
    }

    setSubmitting(true);
    try {
      await createAnswer(questionId, trimmed);
      logActivity("submitted_answer", "Submitted a community answer", { questionId });
      setContent(""); setImages([]);
      queryClient.invalidateQueries({ queryKey: ["answers", questionId] });
      toast.success("Answer submitted!");
    } catch { toast.error("Failed to submit answer."); }
    finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-sm font-bold font-display mb-3">Your Answer</h3>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your knowledge..."
        rows={4}
        className="resize-none bg-muted/50 border-border rounded-xl"
        aria-label="Your answer"
      />
      <div className="mt-3">
        <ImageUpload images={images} onImagesChange={setImages} maxImages={3} />
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-muted-foreground/50">{content.length > 0 ? `${content.length} chars (min 10)` : ""}</span>
        <Button type="submit" size="sm" disabled={submitting} className="gap-2 rounded-xl">
          <Send className="h-3.5 w-3.5" />
          {submitting ? "Submitting..." : "Submit Answer"}
        </Button>
      </div>
    </form>
  );
}
