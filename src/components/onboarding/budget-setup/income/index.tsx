import { Card } from '@/components/ui/card';
import { useData } from '@/lib/data-context';
import { IncomeSetup } from '@/components/shared/income-setup';
import { CurrentCashInput } from '@/components/shared/current-cash-input';
import { PaySchedule } from '@/lib/types';

export function Income() {
  const { data, updateData } = useData();

  const handleSave = (paySchedule: PaySchedule, monthlyIncome: number) => {
    updateData({
      budget: {
        ...data.budget,
        paySchedule,
        income: monthlyIncome,
      },
    });
  };

  const handleCurrentCashChange = (value: number) => {
    updateData({
      budget: {
        ...data.budget,
        currentCash: value,
      },
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Income & Pay Schedule</h3>
      <div className="space-y-6">
        <IncomeSetup
          initialPaySchedule={data.budget.paySchedule}
          onSave={handleSave}
          autoSave={true}
        />
        
        <CurrentCashInput
          value={data.budget.currentCash}
          onChange={handleCurrentCashChange}
        />
      </div>
    </Card>
  );
}