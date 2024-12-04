import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarNav } from './sidebar-nav';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset, useSidebar } from './sidebar';

function SidebarTrigger() {
  const { isMobile, isCollapsed, setIsCollapsed, setIsOpen } = useSidebar();

  return (
    <div className="h-16 px-4 border-b flex items-center md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => isMobile ? setIsOpen(true) : setIsCollapsed(!isCollapsed)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <div className="ml-4 font-semibold">Budgefi</div>
    </div>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-background flex-col md:flex-row">
        <SidebarTrigger />
        <Sidebar>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="w-full">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}