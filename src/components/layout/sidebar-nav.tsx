import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, PieChart, Settings, Coins, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { SettingsDialog } from '@/components/dashboard/settings-dialog';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from './sidebar';

export function SidebarNav() {
  const { isCollapsed } = useSidebar();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2">
        <NavLink 
          to="/"
          className={cn(
            "flex items-center gap-2 mb-4 px-2 font-semibold transition-all duration-300",
            isCollapsed ? "justify-center" : "text-lg"
          )}
        >
          <Coins className="h-5 w-5 text-primary" />
          {!isCollapsed && <span>Budgefi</span>}
        </NavLink>
        <nav className="space-y-1">
          <NavLink
            to="/budget"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center px-2"
              )
            }
            title="Budget"
          >
            <LayoutDashboard className="h-4 w-4" />
            {!isCollapsed && <span>Budget</span>}
          </NavLink>
          <NavLink
            to="/debt"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center px-2"
              )
            }
            title="Debt"
          >
            <Wallet className="h-4 w-4" />
            {!isCollapsed && <span>Debt</span>}
          </NavLink>
          <NavLink
            to="/simulation"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center px-2"
              )
            }
            title="Simulation"
          >
            <TrendingUp className="h-4 w-4" />
            {!isCollapsed && <span>Simulation</span>}
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center px-2"
              )
            }
            title="Reports"
          >
            <PieChart className="h-4 w-4" />
            {!isCollapsed && <span>Reports</span>}
          </NavLink>
        </nav>
      </div>
      <div className={cn(
        "mt-auto p-3 flex flex-col gap-2",
        isCollapsed && "items-center"
      )}>
        <ThemeToggle />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSettingsOpen(true)}
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
}