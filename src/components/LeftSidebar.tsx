import { useState } from "react";
import { Home, Search, PlusCircle, TrendingUp, BarChart2, Bell, User, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoP from "@/assets/logo-v3-p-pulse.png";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/ask", icon: PlusCircle, label: "Ask" },
  { to: "/trending", icon: TrendingUp, label: "Trending" },
  { to: "/portfolio", icon: BarChart2, label: "Portfolio" },
  { to: "/activity", icon: Bell, label: "Activity" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function LeftSidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={cn(
        "hidden md:flex flex-col fixed top-0 left-0 h-screen z-40 border-r border-border bg-background/95 backdrop-blur-xl transition-all duration-300 ease-in-out",
        expanded ? "w-56" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border shrink-0">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
          <img src={logoP} alt="Pulse" className="h-8 w-8 object-contain shrink-0" />
          <span
            className={cn(
              "text-lg font-bold text-foreground whitespace-nowrap transition-all duration-300",
              expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
            )}
          >
            Pulse
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 p-2 mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 group relative overflow-hidden",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                "text-sm font-medium whitespace-nowrap transition-all duration-300",
                expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
              )}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-2 border-t border-border space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <ThemeToggle />
          <span
            className={cn(
              "text-sm text-muted-foreground whitespace-nowrap transition-all duration-300",
              expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
            )}
          >
            Theme
          </span>
        </div>
      </div>
    </aside>
  );
}
