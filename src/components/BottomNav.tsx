import { Home, Search, Plus, BarChart2, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/ask", icon: Plus, label: "Ask", isAction: true },
  { to: "/activity", icon: Activity, label: "Activity" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around h-14 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                item.isAction
                  ? "text-primary"
                  : isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )
            }
          >
            {item.isAction ? (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground -mt-4 shadow-lg shadow-primary/30">
                <item.icon className="h-5 w-5" />
              </div>
            ) : (
              <>
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
