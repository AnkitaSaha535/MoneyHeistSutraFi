import { useHeist } from "@/context/HeistContext";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Gamepad2, BookOpen, Globe, Upload, Library, Flame, Trophy, Calculator, Heart, Target, Users, Receipt, Sun, Moon, LogOut, User, Wallet, Zap, Shield, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const mainItems = [
  { title: "Mission Control", url: "/dashboard", icon: LayoutDashboard },
  { title: "Galaxy Map", url: "/galaxy", icon: Globe },
  { title: "Tactical Arcade", url: "/arcade", icon: Gamepad2 },
  { title: "Knowledge Nebula", url: "/knowledge", icon: BookOpen },
  { title: "Book Vault", url: "/books", icon: Library },
  { title: "Portfolio X-Ray", url: "/cams", icon: Upload },
];

const toolItems = [
  { title: "FIRE Planner", url: "/fire-planner", icon: Target },
  { title: "Health Score", url: "/health-score", icon: Heart },
  { title: "Life Events", url: "/life-events", icon: Users },
  { title: "Tax Wizard", url: "/tax-wizard", icon: Receipt },
  { title: "Couple Planner", url: "/couple-planner", icon: Users },
  { title: "Calculators", url: "/calculators", icon: Calculator },
];

const aiFeatures = [
  { title: "Bank Connect", url: "/bank-connect", icon: Wallet },
  { title: "Credit Simulator", url: "/credit-simulator", icon: Zap },
  { title: "Fraud Alert", url: "/fraud-alert", icon: Shield },
  { title: "AI Advisor", url: "/ai-advisor", icon: Brain },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, toggleTheme, theme, logout, isAuthenticated, userEmail } = useHeist();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const NavSection = ({ items, label }: { items: typeof mainItems; label: string }) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} end className="hover:bg-secondary/50 text-foreground" activeClassName="bg-primary/20 text-primary font-semibold border-l-2 border-primary">
                  <item.icon className="mr-2 h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        {!collapsed && (
          <div className="px-4 py-6 border-b border-border">
            <h1 className="money-title text-2xl tracking-wider">SUTRAFI</h1>
            <p className="text-xs text-muted-foreground mt-1">MONEY COMMAND CENTER</p>
          </div>
        )}

        <NavSection items={mainItems} label="OPERATIONS" />
        <NavSection items={toolItems} label="FINANCIAL TOOLS" />
        <NavSection items={aiFeatures} label="AI FEATURES" />

        {!collapsed && (
          <div className="mt-auto px-4 py-4 border-t border-border space-y-3">
            {isAuthenticated && userEmail && (
              <div className="heist-card p-3">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground truncate">{userEmail}</span>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
            
            <button onClick={toggleTheme}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-secondary text-foreground rounded border border-border hover:border-primary transition-colors heist-mono text-sm">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "LIGHT MODE" : "DARK MODE"}
            </button>
            
            <div className="heist-card p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground">Streak: {userData.streak_days}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Trophy className="h-4 w-4 text-heist-gold" />
                <span className="text-sm text-muted-foreground">Tasks: {userData.daily_tasks}</span>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
