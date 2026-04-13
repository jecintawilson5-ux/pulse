import { Home, Search, PlusCircle, TrendingUp, BarChart2, Bell, User, Settings, LogIn } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CognaraLogo } from "@/components/CognaraLogo";
import { useAuth } from "@/hooks/useAuth";

const mainNav = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/ask", icon: PlusCircle, label: "Ask Question" },
];

const discoverNav = [
  { to: "/trending", icon: TrendingUp, label: "Trending" },
  { to: "/unanswered", icon: Settings, label: "Unanswered" },
  { to: "/portfolio", icon: BarChart2, label: "Portfolio" },
];

const accountNav = [
  { to: "/activity", icon: Bell, label: "Activity" },
  { to: "/profile", icon: User, label: "Profile" },
];

function SidebarLink({ item }: { item: { to: string; icon: React.ElementType; label: string } }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition-all duration-150",
          isActive
            ? "bg-primary/10 text-primary font-semibold"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
          )}
          <item.icon className={cn("h-[22px] w-[22px] shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground")} />
          <span className="truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export function LeftSidebar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const displayName = profile?.username || user?.email?.split("@")[0] || "Guest";
  const initial = displayName[0]?.toUpperCase() || "?";

  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 w-64 border-r border-border bg-sidebar">
      <div className="px-4 pt-6 pb-2">
        <NavLink to="/" className="block px-3 pb-6">
          <CognaraLogo size="lg" />
        </NavLink>
      </div>

      <nav className="flex-1 flex flex-col px-3 overflow-y-auto gap-6">
        <div className="space-y-1">
          {mainNav.map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground/40">
            Discover
          </div>
          <div className="space-y-1">
            {discoverNav.map((item) => (
              <SidebarLink key={item.to} item={item} />
            ))}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground/40">
            Account
          </div>
          <div className="space-y-1">
            {accountNav.map((item) => (
              <SidebarLink key={item.to} item={item} />
            ))}
          </div>
        </div>
      </nav>

      <div className="mt-auto border-t border-border p-4 space-y-3">
        <div className="flex items-center gap-2.5 px-3">
          <ThemeToggle />
          <span className="text-xs text-muted-foreground">Toggle theme</span>
        </div>

        {user ? (
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-foreground leading-tight truncate">{displayName}</div>
              <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => navigate("/auth")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
              <LogIn className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-[13px] font-medium text-muted-foreground">Sign In</div>
          </div>
        )}
      </div>
    </aside>
  );
}
