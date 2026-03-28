import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AskBox() {
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        focused ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">AI-Powered Answers</span>
      </div>
      <Input
        placeholder="What do you want to know?"
        className="bg-transparent border-none p-0 h-auto text-base font-medium placeholder:text-muted-foreground/60 focus-visible:ring-0"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onClick={() => navigate("/ask")}
        readOnly
      />
    </div>
  );
}
