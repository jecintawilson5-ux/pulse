import { Home, TrendingUp, HelpCircle, Activity } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/trending", icon: TrendingUp, label: "Trending" },
  { to: "/unanswered", icon: HelpCircle, label: "Unanswered" },
];

export function LeftSidebar() {
  return (
    <aside className="hidden lg:flex w-56 shrink-0 flex-col gap-1 p-4 border-r border-border">
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
        {/* Inactive item */}
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground/50 cursor-not-allowed">
          <Activity className="h-4 w-4" />
          My Activity
        </div>
      </nav>
    </aside>
  );
}
