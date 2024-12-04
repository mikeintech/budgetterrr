import * as React from "react";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type SidebarContext = {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(!defaultOpen);
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useIsMobile();

  // Reset collapse state when switching between mobile and desktop
  React.useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false);
    }
  }, [isMobile]);

  return (
    <SidebarContext.Provider 
      value={{ 
        isCollapsed, 
        setIsCollapsed, 
        isMobile, 
        isOpen, 
        setIsOpen 
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

interface SidebarProps {
  children: React.ReactNode;
}

function Sidebar({ children }: SidebarProps) {
  const { isMobile, isOpen, setIsOpen, isCollapsed } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "hidden md:block h-screen sticky top-0 border-r transition-all duration-300",
        isCollapsed ? "w-[4rem]" : "w-[16rem]"
      )}
    >
      <CollapseButton />
      {children}
    </aside>
  );
}

function CollapseButton() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  
  return (
    <div className="absolute right-0 top-4 -mr-3 z-10">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-1 rounded-full bg-background border shadow-sm hover:bg-accent"
      >
        <PanelLeft 
          className={cn(
            "h-4 w-4 transition-transform",
            isCollapsed && "rotate-180"
          )} 
        />
      </button>
    </div>
  );
}

interface SidebarContentProps {
  children: React.ReactNode;
}

function SidebarContent({ children }: SidebarContentProps) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className={cn(
      "h-full transition-all duration-300",
      isCollapsed && "overflow-hidden"
    )}>
      {children}
    </div>
  );
}

interface SidebarInsetProps {
  children: React.ReactNode;
}

function SidebarInset({ children }: SidebarInsetProps) {
  return <main className="flex-1 overflow-auto">{children}</main>;
}

export { Sidebar, SidebarContent, SidebarInset, SidebarProvider, useSidebar };