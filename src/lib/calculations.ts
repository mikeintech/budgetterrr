import { addMonths, startOfMonth } from 'date-fns';
import { UserData } from './types';

export function calculateNetSavings(data: UserData): number {
  const { transactions } = data;
  return transactions.reduce((total, t) => {
    return total + (t.type === 'income' ? t.amount : -t.amount);
  }, 0);
}

export function calculateMonthlyIncome(data: UserData): number {
  return data.budget.income || 0;
}

export function calculateMonthlyExpenses(data: UserData): number {
  return Object.values(data.budget.expenses).reduce((sum, amount) => sum + (amount || 0), 0);
}

export function calculateMonthlySavingsRate(data: UserData): number {
  const monthlyIncome = calculateMonthlyIncome(data);
  const monthlyExpenses = calculateMonthlyExpenses(data);
  return monthlyIncome - monthlyExpenses;
}

export function calculateProjectedSavings(data: UserData, monthsElapsed: number): number {
  const currentSavings = data.savingsGoal.currentAmount;
  const monthlySavings = calculateMonthlySavingsRate(data);
  return currentSavings + (monthlySavings * monthsElapsed);
}

export function calculateMonthlyGoal(amount: number, timeline: number): number {
  return timeline > 0 ? amount / timeline : 0;
}

export function calculateProgress(currentAmount: number, goalAmount: number): number {
  if (goalAmount <= 0) return 0;
  const progress = (currentAmount / goalAmount) * 100;
  return Math.min(Math.max(0, progress), 100);
}

export function getProjectedCompletionDate(
  startDate: Date,
  goalAmount: number,
  monthlySavingsRate: number
): Date {
  if (monthlySavingsRate <= 0) return addMonths(startDate, 24);
  const monthsToGoal = Math.ceil(goalAmount / monthlySavingsRate);
  return addMonths(startOfMonth(startDate), monthsToGoal);
}