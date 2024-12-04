import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useData } from '@/lib/data-context';
import { toast } from 'sonner';
import { PaySchedule } from '@/lib/types';
import { SavingsSection } from './savings-section';
import { ExpensesSection } from './expenses-section';
import { IncomeSetup } from '@/components/shared/income-setup';
import { ExpenseAllocation } from '@/components/shared/expense-allocation';
import { CurrentCashInput } from '@/components/shared/current-cash-input';

interface BudgetAdjusterProps {
  onClose?: () => void;
}

export function BudgetAdjuster({ onClose }: BudgetAdjusterProps) {
  const { data, updateData } = useData();
  const [localPaySchedule, setLocalPaySchedule] = useState<PaySchedule>(data.budget.paySchedule);
  const [localMonthlyIncome, setLocalMonthlyIncome] = useState(data.budget.income);
  const [expenseAllocation, setExpenseAllocation] = useState(data.budget.expenseAllocation);
  const [currentCash, setCurrentCash] = useState(data.budget.currentCash);
  const [savingsData, setSavingsData] = useState({
    targetSavings: data.budget.targetSavings.toString(),
    savingsGoal: data.savingsGoal.amount.toString(),
    savingsTimeline: data.savingsGoal.timeline.toString(),
  });
  const [expensesData, setExpensesData] = useState({
    housing: (data.budget.expenses.housing || 0).toString(),
    transportation: (data.budget.expenses.transportation || 0).toString(),
    food: (data.budget.expenses.food || 0).toString(),
    utilities: (data.budget.expenses.utilities || 0).toString(),
    entertainment: (data.budget.expenses.entertainment || 0).toString(),
  });

  const handleIncomeChange = (schedule: PaySchedule, monthlyIncome: number) => {
    setLocalPaySchedule(schedule);
    setLocalMonthlyIncome(monthlyIncome);
  };

  const calculateTotalExpenses = () => {
    const baseExpenses = Object.values(expensesData).reduce((sum, val) => sum + (Number(val) || 0), 0);
    const customExpenses = data.budget.customExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
    return baseExpenses + customExpenses;
  };

  const handleSave = () => {
    const newBudget = {
      income: localMonthlyIncome,
      targetSavings: Number(savingsData.targetSavings) || 0,
      currentCash: currentCash,
      expenses: {
        housing: Number(expensesData.housing) || 0,
        transportation: Number(expensesData.transportation) || 0,
        food: Number(expensesData.food) || 0,
        utilities: Number(expensesData.utilities) || 0,
        entertainment: Number(expensesData.entertainment) || 0,
      },
      customExpenses: data.budget.customExpenses || [],
      paySchedule: localPaySchedule,
      expenseAllocation,
    };

    const newSavingsGoal = {
      amount: Number(savingsData.savingsGoal) || 0,
      timeline: Number(savingsData.savingsTimeline) || 12,
      startDate: data.savingsGoal.startDate,
      currentAmount: data.savingsGoal.currentAmount,
    };

    updateData({ 
      budget: newBudget,
      savingsGoal: newSavingsGoal,
    });
    
    toast.success('Budget updated successfully');
    onClose?.();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <IncomeSetup
          initialPaySchedule={data.budget.paySchedule}
          onChange={handleIncomeChange}
          autoSave={false}
        />

        <CurrentCashInput
          value={currentCash}
          onChange={setCurrentCash}
        />

        <SavingsSection
          data={savingsData}
          onChange={(field, value) => setSavingsData(prev => ({ ...prev, [field]: value }))}
        />

        <ExpensesSection
          data={expensesData}
          onChange={(field, value) => setExpensesData(prev => ({ ...prev, [field]: value }))}
        />

        <ExpenseAllocation
          paySchedule={localPaySchedule}
          totalExpenses={calculateTotalExpenses()}
          onAllocationChange={setExpenseAllocation}
        />
        
        <Button onClick={handleSave} className="w-full">Save Changes</Button>
      </div>
    </div>
  );
}