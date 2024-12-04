import { Coins } from 'lucide-react';

export function Footer() {
  return (
    <footer className="container mx-auto px-4 py-8 border-t">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          <span className="font-semibold">BudgetSmart</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} BudgetSmart. All rights reserved.
        </p>
      </div>
    </footer>
  );
}