import { Schedule } from '@/lib/types';

export function getAdjustedAmount(amount: number, schedule: Schedule): number {
  switch (schedule) {
    case 'semi-monthly':
      return amount / 2; // Exactly 2 payments per month
    case 'biweekly':
      return amount / 2.17; // Average number of biweekly periods in a month
    case 'weekly':
      return amount / 4.33; // Average number of weeks in a month
    default:
      return amount;
  }
}

export function getPaymentPeriodLabel(schedule: Schedule): string {
  switch (schedule) {
    case 'semi-monthly':
      return 'Semi-monthly';
    case 'biweekly':
      return 'Bi-weekly';
    case 'weekly':
      return 'Weekly';
    default:
      return 'Monthly';
  }
}

export function getPaymentsPerYear(schedule: Schedule): number {
  switch (schedule) {
    case 'semi-monthly':
      return 24;
    case 'biweekly':
      return 26;
    case 'weekly':
      return 52;
    default:
      return 12;
  }
}