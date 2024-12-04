import { DebtAccount, AmortizationEntry } from '../types';
import { addMonths, format } from 'date-fns';

export function calculateAmortizationSchedule(
  debt: DebtAccount,
  monthlyPayment: number,
  startDate: Date = new Date()
): AmortizationEntry[] {
  const schedule: AmortizationEntry[] = [];
  let balance = debt.balance;
  let currentDate = startDate;
  const monthlyRate = debt.interestRate / 100 / 12;

  while (balance > 0 && schedule.length < 360) { // 30 years max
    const interest = balance * monthlyRate;
    const principal = Math.min(monthlyPayment - interest, balance);
    balance = balance - principal;

    schedule.push({
      date: currentDate,
      payment: monthlyPayment,
      principal,
      interest,
      remainingBalance: balance
    });

    currentDate = addMonths(currentDate, 1);

    // Break if payment is too small to cover interest
    if (monthlyPayment <= interest) break;
  }

  return schedule;
}

export function calculatePayoffDate(schedule: AmortizationEntry[]): Date | null {
  if (schedule.length === 0) return null;
  return schedule[schedule.length - 1].date;
}

export function calculateTotalInterest(schedule: AmortizationEntry[]): number {
  return schedule.reduce((sum, entry) => sum + entry.interest, 0);
}

export function calculateMinimumPaymentTotal(debts: DebtAccount[]): number {
  return debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
}

export function getDebtTypeLabel(type: DebtAccount['type']): string {
  const labels: Record<DebtAccount['type'], string> = {
    credit_card: 'Credit Card',
    student_loan: 'Student Loan',
    car_loan: 'Car Loan',
    personal_loan: 'Personal Loan',
    mortgage: 'Mortgage',
    other: 'Other'
  };
  return labels[type];
}