import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useHeist } from "@/context/HeistContext";

export default function HeistLayout() {
  const { userData } = useHeist();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          <header className="h-12 flex items-center border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <SidebarTrigger className="ml-3 text-foreground" />
            <div className="ml-4 flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium">
                Streak: {userData.streak_days} days | Tasks: {userData.daily_tasks}
              </span>
            </div>
          </header>
          <main className="flex-1 relative">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
