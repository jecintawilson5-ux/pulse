import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CognaraLogo } from "@/components/CognaraLogo";

export function TopNav() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-3 px-4">
        <button onClick={() => navigate("/")} className="shrink-0">
          <CognaraLogo size="sm" />
        </button>

        <form onSubmit={handleSearch} className="flex-1 max-w-sm mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-muted border-none rounded-xl pl-9 pr-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </form>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button onClick={() => navigate("/ask")} size="sm" className="gap-1.5 h-8 text-xs rounded-xl">
            <Plus className="h-3.5 w-3.5" />
            Ask
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
