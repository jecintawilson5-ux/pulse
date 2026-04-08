import { TopNav } from "./TopNav";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "./OfflineBanner";
import { MobileDiscoverSheet } from "./MobileDiscoverSheet";

export function Layout({ children, showSidebars = true }: { children: React.ReactNode; showSidebars?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="lg:hidden">
        <TopNav />
      </div>
      <OfflineBanner />
      <LeftSidebar />
      <div className="flex flex-1 lg:ml-64">
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</main>
        {showSidebars && <RightSidebar />}
      </div>
      <BottomNav />
      {showSidebars && <MobileDiscoverSheet />}
    </div>
  );
}
