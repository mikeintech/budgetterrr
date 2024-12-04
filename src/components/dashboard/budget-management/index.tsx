import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { PaymentSchedule } from './payment-schedule/index';
import { SpendingBreakdown } from './spending-breakdown';
import { BudgetAdjustmentModal } from './budget-adjustment-modal';
import { CashSummary } from './cash-summary';
import { GoalsOverview } from '../goals/goals-overview';

export function BudgetManagement() {
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="col-span-full rounded-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Budget Management</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAdjustmentModalOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Adjust Budget
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <CashSummary />
          {/* <GoalsOverview /> */}
          <PaymentSchedule />
          <SpendingBreakdown />
        </CardContent>

        <BudgetAdjustmentModal 
          open={isAdjustmentModalOpen} 
          onOpenChange={setIsAdjustmentModalOpen}
        />
      </Card>
    </div>
  );
}