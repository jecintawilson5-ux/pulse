import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/lib/activity";
import { toast } from "sonner";

interface ReportButtonProps {
  contentId: string;
  contentType: "question" | "answer";
}

export function ReportButton({ contentId, contentType }: ReportButtonProps) {
  const [reported, setReported] = useState(false);

  const handleReport = async () => {
    if (reported) return;
    const reason = prompt("Why are you reporting this?");
    if (!reason || reason.trim().length < 3) return;

    try {
      const { error } = await supabase.from("reports" as any).insert({
        content_id: contentId,
        content_type: contentType,
        reporter_session_id: getSessionId(),
        reason: reason.trim(),
      } as any);

      if (error) throw error;
      setReported(true);
      toast.success("Report submitted. Thank you.");
    } catch {
      toast.error("Failed to submit report.");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleReport}
      disabled={reported}
      className="gap-1 text-xs text-muted-foreground hover:text-destructive"
    >
      <Flag className="h-3 w-3" />
      {reported ? "Reported" : "Report"}
    </Button>
  );
}
