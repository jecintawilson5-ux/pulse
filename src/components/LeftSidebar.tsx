import { Home, Search, Plus, TrendingUp, Archive, Bell, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PulseLogo } from "@/components/PulseLogo";

const mainNav = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/ask", icon: Plus, label: "Ask Question", badge: "+" },
];

const discoverNav = [
  { to: "/trending", icon: TrendingUp, label: "Trending" },
  { to: "/portfolio", icon: Archive, label: "Portfolio" },
];

const accountNav = [
  { to: "/activity", icon: Bell, label: "Activity", badgeCount: 3 },
  { to: "/profile", icon: User, label: "Profile" },
];

function SidebarLink({ item }: { item: { to: string; icon: React.ElementType; label: string; badge?: string; badgeCount?: number } }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-[9px] text-[13.5px] transition-all duration-150",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-primary rounded-r-sm" />
          )}
          <item.icon className="h-4 w-4 shrink-0 opacity-70 group-[.text-primary]:opacity-100" />
          <span>{item.label}</span>
          {item.badge && (
            <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-px rounded-full min-w-[18px] text-center">
              {item.badge}
            </span>
          )}
          {item.badgeCount && (
            <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-semibold px-1.5 py-px rounded-full min-w-[18px] text-center">
              {item.badgeCount}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export function LeftSidebar() {
  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 w-[220px] border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="px-3 pt-5 pb-1">
        <NavLink to="/" className="block px-2.5 pb-5">
          <PulseLogo size="md" />
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-3 overflow-y-auto">
        <div className="space-y-0.5">
          {mainNav.map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}
        </div>

        <div className="mt-4">
          <div className="px-2.5 mb-1 text-[10px] font-semibold tracking-[0.08em] uppercase text-muted-foreground/50">
            Discover
          </div>
          <div className="space-y-0.5">
            {discoverNav.map((item) => (
              <SidebarLink key={item.to} item={item} />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="px-2.5 mb-1 text-[10px] font-semibold tracking-[0.08em] uppercase text-muted-foreground/50">
            Account
          </div>
          <div className="space-y-0.5">
            {accountNav.map((item) => (
              <SidebarLink key={item.to} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom user card */}
      <div className="mt-auto border-t border-border p-3">
        <div className="flex items-center gap-2 px-2.5">
          <ThemeToggle />
          <span className="text-xs text-muted-foreground">Theme</span>
        </div>
        <div className="flex items-center gap-2.5 px-2.5 py-2 mt-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent2 flex items-center justify-center text-xs font-bold text-white shrink-0">
            V
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-foreground leading-tight truncate">Valor</div>
            <div className="text-[11px] text-muted-foreground">Member · 142 pts</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
