import { UserData } from '../types';

export function calculateMonthlyGoal(targetAmount: number, timelineMonths: number): number {
  return timelineMonths > 0 ? targetAmount / timelineMonths : 0;
}

export function calculateProgress(currentAmount: number, goalAmount: number): number {
  if (goalAmount <= 0) return 0;
  const progress = (currentAmount / goalAmount) * 100;
  return Math.min(Math.max(0, progress), 100);
}

export function calculateProjectedTimeToGoal(
  currentAmount: number,
  goalAmount: number,
  monthlyTarget: number
): number {
  if (monthlyTarget <= 0) return Infinity;
  const remaining = goalAmount - currentAmount;
  return Math.ceil(remaining / monthlyTarget);
}

export function calculateRequiredMonthlyTarget(
  currentAmount: number,
  goalAmount: number,
  timelineMonths: number
): number {
  const remaining = goalAmount - currentAmount;
  return timelineMonths > 0 ? remaining / timelineMonths : 0;
}

export function isMonthlyTargetSufficient(
  monthlyTarget: number,
  currentAmount: number,
  goalAmount: number,
  timelineMonths: number
): boolean {
  const requiredMonthly = calculateRequiredMonthlyTarget(
    currentAmount,
    goalAmount,
    timelineMonths
  );
  return monthlyTarget >= requiredMonthly;
}

export function calculateProjectedSavings(data: UserData, monthsElapsed: number): number {
  const { currentAmount } = data.savingsGoal;
  const { targetSavings } = data.budget;
  return currentAmount + (targetSavings * monthsElapsed);
}