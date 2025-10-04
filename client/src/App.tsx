import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import EventsPage from "@/pages/events";
import FeedersPage from "@/pages/feeders";
import SubstationsPage from "@/pages/substations";
import WaveformsPage from "@/pages/waveforms";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={DashboardPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/feeders" component={FeedersPage} />
      <Route path="/substations" component={SubstationsPage} />
      <Route path="/waveforms" component={WaveformsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const [location] = useLocation();

  if (location === "/login") {
    return <Router />;
  }

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 px-6 py-3 border-b border-border bg-background sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div className="hidden sm:flex items-center gap-2">
                <img 
                  src="/attached_assets/SIH P-1_LOGO_1759550517457.jpg" 
                  alt="KSEBL Logo" 
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <h2 className="text-sm font-bold">KSEBL LIFE LINE</h2>
                  <p className="text-xs text-muted-foreground">Real-time Detection System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-background">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppLayout />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
