import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";

export function AskBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/ask?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-[600px] mx-auto animate-fade-up-delay-1">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/40 pointer-events-none" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What do you want to know?"
        className="w-full bg-card border border-border rounded-2xl py-4 pl-14 pr-[130px] text-foreground text-[15px] outline-none transition-all focus:border-primary/50 focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.08)] placeholder:text-muted-foreground/35"
      />
      <button
        type="submit"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-[13px] font-semibold hover:opacity-90 active:scale-[0.97] transition-all flex items-center gap-2 shadow-md shadow-primary/20"
      >
        Ask AI
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
