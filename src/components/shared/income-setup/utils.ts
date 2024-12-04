import { PaySchedule } from '@/lib/types';
import { startOfMonth, addDays } from 'date-fns';

export function calculateMonthlyIncome(frequency: PaySchedule['frequency'], amount: number): number {
  switch (frequency) {
    case 'weekly':
      return amount * 52 / 12;
    case 'biweekly':
      return amount * 26 / 12;
    case 'semi_monthly':
      return amount * 24 / 12;
    case 'monthly':
    default:
      return amount;
  }
}

export function getInitialPaySchedule(): PaySchedule {
  const nextPayDate = startOfMonth(addDays(new Date(), 14));
  return {
    frequency: 'monthly',
    firstPayDay: 1,
    nextPayDate: nextPayDate.toISOString(),
    amount: 0
  };
}