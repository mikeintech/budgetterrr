import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DebtAccountForm } from './debt-account-form';
import { DebtSummary } from './debt-summary';
import { AmortizationSchedule } from './amortization-schedule';

export function DebtManagement() {
  return (
    <Card className="col-span-full rounded-none">
      <CardHeader>
        <CardTitle>Debt Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DebtSummary />
        <DebtAccountForm />
        <AmortizationSchedule />
      </CardContent>
    </Card>
  );
}