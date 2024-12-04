import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroBar } from './sections/hero-bar';
import { BudgetAllocation } from './sections/budget-allocation';
import { PayCycleSummary } from './sections/pay-cycle-summary';
import { SpendingBreakdown } from './sections/spending-breakdown';
import { ExpenseAllocationSection } from './sections/expense-allocation';
import { BudgetProvider } from '@/lib/budget-context';

export function BudgetManagementV2() {
  return (
    <BudgetProvider>
      <Card className="col-span-full rounded-none">
        <CardHeader>
          <CardTitle>Budget Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <HeroBar />
          {/* <ExpenseAllocationSection /> */}
          
          <div className="grid gap-6 lg:grid-cols-2">
            <BudgetAllocation />
            <PayCycleSummary />
          </div>

          <SpendingBreakdown />
        </CardContent>
      </Card>
    </BudgetProvider>
  );
}