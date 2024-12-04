import { useState } from 'react';
import { Menu, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SettingsDialog } from './settings-dialog';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-4">
            {/* <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col gap-4">
                  <Button variant="ghost">Overview</Button>
                  <Button variant="ghost">Goals</Button>
                  <Button variant="ghost">Transactions</Button>
                  <Button variant="ghost" onClick={() => setIsSettingsOpen(true)}>
                    Settings
                  </Button>
                </nav>
              </SheetContent>
            </Sheet> */}
            <h1 className="text-xl font-semibold">Budgefi</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button
              onClick={() => setIsAddingTransaction(true)}
              size="icon"
              className="md:hidden"
              variant="default"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setIsAddingTransaction(true)}
              className="hidden md:flex"
              variant="default"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button> */}
            <Button
              onClick={() => setIsSettingsOpen(true)}
              variant="outline"
         
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-0 sm:px-4 sm:py-6">{children}</main>

      
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
}