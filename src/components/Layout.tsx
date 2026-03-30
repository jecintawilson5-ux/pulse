import { TopNav } from "./TopNav";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "./OfflineBanner";

export function Layout({ children, showSidebars = true }: { children: React.ReactNode; showSidebars?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <OfflineBanner />
      <div className="flex flex-1">
        {showSidebars && <LeftSidebar />}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
        {showSidebars && <RightSidebar />}
      </div>
      <BottomNav />
    </div>
  );
}
