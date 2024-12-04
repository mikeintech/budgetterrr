import { format, isValid } from 'date-fns';

export function formatTimeElapsed(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = Math.floor(months % 12);
  if (years === 0) return `${remainingMonths} months`;
  if (remainingMonths === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
  return `${years}y ${remainingMonths}m`;
}

export function formatDate(date: Date): string {
  return isValid(date) ? format(date, 'MMMM yyyy') : 'Invalid Date';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}