import { Schedule } from '@/lib/types';

export function calculatePeriodicPayment(amount: number, months: number, schedule: Schedule = 'monthly'): number {
  const monthlyAmount = amount / months;
  
  switch (schedule) {
    case 'semi-monthly':
      return monthlyAmount / 2; // Exactly 2 payments per month
    case 'biweekly':
      return monthlyAmount / 2.17; // Average number of biweekly periods in a month
    case 'weekly':
      return monthlyAmount / 4.33; // Average number of weeks in a month
    default:
      return monthlyAmount;
  }
}

export function generateSavingsGoals(currentSavings: number, monthlyIncome: number): number[] {
  // Calculate annual income
  const annualIncome = monthlyIncome * 12;
  
  // Generate goals based on income multiples (3, 6, 9, 12 months of income)
  const incomeBasedGoals = [0.5, 1, 2, 3, 6, 9, 12].map(months => {
    const amount = Math.round(monthlyIncome * months / 1000) * 1000; // Round to nearest thousand
    return amount;
  });

  // Filter out goals that are too small compared to current savings
  const validGoals = incomeBasedGoals
    .filter(goal => goal >= currentSavings)
    .filter(goal => goal <= annualIncome * 2) // Cap at 2x annual income
    .sort((a, b) => a - b);

  // If no valid goals (rare case), generate some reasonable defaults
  if (validGoals.length === 0) {
    const minGoal = Math.max(
      Math.round(currentSavings / 1000) * 1000,
      Math.round(monthlyIncome / 1000) * 1000
    );
    return [minGoal, minGoal * 1.5, minGoal * 2].map(Math.round);
  }

  return validGoals;
}

export function getTimeframes() {
  return [
    { months: 3, label: '3 Months' },
    { months: 6, label: '6 Months' },
    { months: 12, label: '1 Year' },
    { months: 24, label: '2 Years' },
  ];
}