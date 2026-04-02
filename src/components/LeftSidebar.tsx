import { Home, Search, PlusCircle, TrendingUp, BarChart2, Bell, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PulseLogo } from "@/components/PulseLogo";
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
  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 w-64 border-r border-border bg-background/95 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center h-16 px-5 border-b border-border shrink-0">
        <NavLink to="/" className="flex items-center gap-3">
          <img src={logoP} alt="Pulse" className="h-9 w-9 object-contain shrink-0" />
          <span className="text-xl font-bold text-foreground">Pulse</span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 p-3 mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 transition-colors duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )
            }
          >
            <item.icon className="h-6 w-6 shrink-0" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <ThemeToggle />
          <span className="text-sm text-muted-foreground">Theme</span>
        </div>
      </div>
    </aside>
  );
}
