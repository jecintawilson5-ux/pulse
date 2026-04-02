import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

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
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What do you want to know?"
        className="w-full bg-card border border-border rounded-[14px] py-3.5 pl-12 pr-[120px] text-foreground text-[14.5px] outline-none transition-all focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] placeholder:text-muted-foreground/40"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-[9px] px-4 py-[7px] text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all"
      >
        Ask AI ↵
      </button>
    </form>
  );
}
