import { useState } from 'react';
import { useData } from '@/lib/data-context';
import { formatCurrency } from '@/lib/utils';
import { PaymentCard } from './payment-card';
import { SavingsGoalCard } from './savings-goal-card';
import { PayScheduleInfo } from './pay-schedule-info';

export function PaymentSchedule() {
  const { data } = useData();
  const { paySchedule } = data.budget;

  // Calculate total expenses
  const totalBaseExpenses = Object.values(data.budget.expenses).reduce((sum, amount) => sum + amount, 0);
  const totalCustomExpenses = data.budget.customExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const totalExpenses = totalBaseExpenses + totalCustomExpenses;

  // Calculate per-paycheck amounts
  const perPaycheckExpenses = (() => {
    switch (paySchedule.frequency) {
      case 'weekly':
        return totalExpenses / 4.33;
      case 'biweekly':
        return totalExpenses / 2.17;
      case 'semi_monthly':
        return totalExpenses / 2;
      case 'monthly':
      default:
        return totalExpenses;
    }
  })();

  const perPaycheckSavings = (() => {
    switch (paySchedule.frequency) {
      case 'weekly':
        return data.budget.targetSavings / 4.33;
      case 'biweekly':
        return data.budget.targetSavings / 2.17;
      case 'semi_monthly':
        return data.budget.targetSavings / 2;
      case 'monthly':
      default:
        return data.budget.targetSavings;
    }
  })();

  const remainingAmount = paySchedule.amount - perPaycheckExpenses - perPaycheckSavings;

  return (
    <div className="space-y-4">
      <PayScheduleInfo />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <PaymentCard
          label="Per Paycheck"
          amount={paySchedule.amount}
          sublabel={`${paySchedule.frequency === 'weekly' ? '52x' : 
            paySchedule.frequency === 'biweekly' ? '26x' : 
            paySchedule.frequency === 'semi_monthly' ? '24x' : '12x'} per year`}
        />
        <PaymentCard
          label="Expenses"
          amount={perPaycheckExpenses}
          sublabel="Per paycheck"
        />
        <PaymentCard
          label="Savings"
          amount={perPaycheckSavings}
          sublabel="Per paycheck"
        />
        <PaymentCard
          label="Ending Cash"
          amount={remainingAmount}
          sublabel="Per paycheck after expenses & savings"
          variant={remainingAmount < 0 ? 'error' : 'success'}
        />
      </div>

      <SavingsGoalCard
        currentAmount={data.savingsGoal.currentAmount}
        goalAmount={data.savingsGoal.amount}
      />
    </div>
  );
}