import { AppSidebar } from "../app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold">Main Content Area</h1>
          <p className="text-muted-foreground mt-2">The sidebar navigation is shown on the left</p>
        </div>
      </div>
    </SidebarProvider>
  );
}
