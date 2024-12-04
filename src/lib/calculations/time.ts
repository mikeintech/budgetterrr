import { addDays, addWeeks, addMonths, startOfMonth } from 'date-fns';
import { UserData, PaySchedule } from '../types';

export function processTimeBasedUpdates(data: UserData): UserData {
  const nextPayDate = new Date(data.budget.paySchedule.nextPayDate);
  const currentDate = new Date();
  
  // If we haven't passed the next pay date, return data unchanged
  if (nextPayDate > currentDate) {
    return data;
  }

  // Calculate pay periods passed based on frequency
  const payPeriods = calculatePayPeriodsPassed(data.budget.paySchedule, currentDate);
  
  if (payPeriods <= 0) {
    return data;
  }

  // Calculate monthly amounts
  const { monthlySavings, monthlyExpenses } = calculateMonthlyAmounts(data);

  // Calculate per-period amounts based on frequency
  const { savingsPerPeriod, expensesPerPeriod } = calculatePerPeriodAmounts(
    data.budget.paySchedule.frequency,
    monthlySavings,
    monthlyExpenses
  );

  // Calculate net change per period
  const netChangePerPeriod = data.budget.paySchedule.amount - expensesPerPeriod - savingsPerPeriod;
  
  // Calculate updated amounts
  const updatedCash = data.budget.currentCash + (netChangePerPeriod * payPeriods);
  const updatedSavings = data.savingsGoal.currentAmount + (savingsPerPeriod * payPeriods);
  
  // Calculate new next pay date
  const newNextPayDate = calculateNextPayDate(data.budget.paySchedule, payPeriods);

  // Return updated data
  return {
    ...data,
    budget: {
      ...data.budget,
      currentCash: updatedCash,
      paySchedule: {
        ...data.budget.paySchedule,
        nextPayDate: newNextPayDate.toISOString(),
      },
    },
    savingsGoal: {
      ...data.savingsGoal,
      currentAmount: updatedSavings,
    },
  };
}

function calculatePayPeriodsPassed(paySchedule: PaySchedule, currentDate: Date): number {
  const lastPayDate = new Date(paySchedule.nextPayDate);
  const daysDiff = Math.floor((currentDate.getTime() - lastPayDate.getTime()) / (1000 * 60 * 60 * 24));
  
  switch (paySchedule.frequency) {
    case 'weekly':
      return Math.floor(daysDiff / 7);
    case 'biweekly':
      return Math.floor(daysDiff / 14);
    case 'semi_monthly':
      return Math.floor(daysDiff / 15);
    case 'monthly':
      return Math.floor(daysDiff / 30);
    default:
      return 0;
  }
}

function calculateMonthlyAmounts(data: UserData) {
  const monthlySavings = data.budget.targetSavings;
  const baseExpenses = Object.values(data.budget.expenses).reduce((sum, amount) => sum + amount, 0);
  const customExpenses = data.budget.customExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const monthlyExpenses = baseExpenses + customExpenses;

  return { monthlySavings, monthlyExpenses };
}

function calculatePerPeriodAmounts(
  frequency: PaySchedule['frequency'],
  monthlySavings: number,
  monthlyExpenses: number
) {
  let savingsPerPeriod: number;
  let expensesPerPeriod: number;

  switch (frequency) {
    case 'weekly':
      savingsPerPeriod = monthlySavings / 4.33;
      expensesPerPeriod = monthlyExpenses / 4.33;
      break;
    case 'biweekly':
      savingsPerPeriod = monthlySavings / 2.17;
      expensesPerPeriod = monthlyExpenses / 2.17;
      break;
    case 'semi_monthly':
      savingsPerPeriod = monthlySavings / 2;
      expensesPerPeriod = monthlyExpenses / 2;
      break;
    case 'monthly':
    default:
      savingsPerPeriod = monthlySavings;
      expensesPerPeriod = monthlyExpenses;
  }

  return { savingsPerPeriod, expensesPerPeriod };
}

function calculateNextPayDate(paySchedule: PaySchedule, payPeriods: number): Date {
  const currentPayDate = new Date(paySchedule.nextPayDate);
  
  switch (paySchedule.frequency) {
    case 'weekly':
      return addWeeks(currentPayDate, payPeriods);
    case 'biweekly':
      return addWeeks(currentPayDate, payPeriods * 2);
    case 'semi_monthly':
      return addDays(currentPayDate, payPeriods * 15);
    case 'monthly':
      return addMonths(currentPayDate, payPeriods);
    default:
      return startOfMonth(addMonths(currentPayDate, payPeriods));
  }
}