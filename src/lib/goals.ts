import { Goal, GoalAlert, GoalCategory } from './types';

export function calculateGoalProgress(goal: Goal): number {
  if (goal.targetAmount <= 0) return 0;
  return (goal.currentAmount / goal.targetAmount) * 100;
}

export function getRequiredMonthlyContribution(goal: Goal): number {
  const targetDate = new Date(goal.targetDate);
  const now = new Date();
  const monthsRemaining = getMonthsBetweenDates(now, targetDate);
  
  if (monthsRemaining <= 0) return 0;
  
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  return remainingAmount / monthsRemaining;
}

export function isGoalOnTrack(goal: Goal): boolean {
  const requiredContribution = getRequiredMonthlyContribution(goal);
  return goal.monthlyContribution >= requiredContribution;
}

export function getProjectedCompletionDate(goal: Goal): Date {
  if (goal.monthlyContribution <= 0) return new Date(goal.targetDate);
  
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const monthsToComplete = remainingAmount / goal.monthlyContribution;
  
  const projectedDate = new Date();
  projectedDate.setMonth(projectedDate.getMonth() + Math.ceil(monthsToComplete));
  return projectedDate;
}

export function checkGoalAlerts(goal: Goal): GoalAlert[] {
  const progress = calculateGoalProgress(goal);
  const alerts: GoalAlert[] = [];
  const now = new Date();
  const targetDate = new Date(goal.targetDate);

  // Check milestone alerts
  if (progress >= 25 && progress < 26) {
    alerts.push(createAlert('milestone', '25% of your goal achieved!', 25));
  }
  if (progress >= 50 && progress < 51) {
    alerts.push(createAlert('milestone', '50% of your goal achieved!', 50));
  }
  if (progress >= 75 && progress < 76) {
    alerts.push(createAlert('milestone', '75% of your goal achieved!', 75));
  }

  // Check if behind schedule
  const expectedProgress = (getMonthsBetweenDates(new Date(goal.createdAt), now) / 
    getMonthsBetweenDates(new Date(goal.createdAt), targetDate)) * 100;
  
  if (progress < expectedProgress - 10) {
    alerts.push(createAlert('behind', 'You\'re falling behind on your goal', expectedProgress - progress));
  }

  // Check deadline approaching
  const monthsToDeadline = getMonthsBetweenDates(now, targetDate);
  if (monthsToDeadline <= 3 && progress < 90) {
    alerts.push(createAlert('deadline', 'Goal deadline approaching with significant amount remaining', monthsToDeadline));
  }

  return alerts;
}

function getMonthsBetweenDates(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + 
         (end.getMonth() - start.getMonth());
}

function createAlert(
  type: GoalAlert['type'], 
  message: string, 
  threshold: number
): GoalAlert {
  return {
    id: Date.now().toString(),
    type,
    message,
    threshold,
    triggered: false,
    createdAt: new Date().toISOString()
  };
}

export const GOAL_CATEGORIES: { value: GoalCategory; label: string }[] = [
  { value: 'emergency', label: 'Emergency Fund' },
  { value: 'vacation', label: 'Vacation' },
  { value: 'car', label: 'Car' },
  { value: 'house', label: 'House' },
  { value: 'education', label: 'Education' },
  { value: 'retirement', label: 'Retirement' },
  { value: 'debt', label: 'Debt Repayment' },
  { value: 'other', label: 'Other' }
];