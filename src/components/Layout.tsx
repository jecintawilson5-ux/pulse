import { TopNav } from "./TopNav";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";

export function Layout({ children, showSidebars = true }: { children: React.ReactNode; showSidebars?: boolean }) {
  return (
    <div className="dark min-h-screen flex flex-col">
      <TopNav />
      <div className="flex flex-1">
        {showSidebars && <LeftSidebar />}
        <main className="flex-1 overflow-y-auto">{children}</main>
        {showSidebars && <RightSidebar />}
      </div>
    </div>
  );
}
