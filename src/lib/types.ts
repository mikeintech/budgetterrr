import { z } from 'zod';

export type GoalCategory = 'emergency' | 'vacation' | 'car' | 'house' | 'education' | 'retirement' | 'debt' | 'other';

export interface Goal {
  id: string;
  name: string;
  category: GoalCategory;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'low' | 'medium' | 'high';
  autoSave: boolean;
  monthlyContribution: number;
  createdAt: string;
  alerts: GoalAlert[];
}

export interface GoalAlert {
  id: string;
  type: 'milestone' | 'behind' | 'ahead' | 'deadline';
  message: string;
  threshold: number; // Percentage or amount depending on type
  triggered: boolean;
  createdAt: string;
}

export interface SavingsGoal {
  amount: number;
  timeline: number;
  startDate: string;
  currentAmount: number;
  goals: Goal[];
}

// Rest of the existing types remain the same
export interface PaySchedule {
  frequency: 'weekly' | 'biweekly' | 'semi_monthly' | 'monthly';
  dayOfWeek?: number;
  firstPayDay?: number;
  secondPayDay?: number;
  nextPayDate: string;
  amount: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
}

export interface Budget {
  income: number;
  expenses: Record<string, number>;
  customExpenses: ExpenseCategory[];
  targetSavings: number;
  currentCash: number;
  paySchedule: PaySchedule;
  expenseAllocation: 'evenly' | 'first_check' | 'last_check' | 'custom';
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  description: string;
}

export interface DebtAccount {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  type: 'credit_card' | 'student_loan' | 'car_loan' | 'personal_loan' | 'mortgage' | 'other';
}

export interface AmortizationEntry {
  date: Date;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface UserData {
  savingsGoal: SavingsGoal;
  budget: Budget;
  transactions: Transaction[];
  debts: DebtAccount[];
}

export const expenseCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Category name is required"),
  amount: z.number().min(0, "Amount must be positive")
});

export type ExpenseCategorySchema = z.infer<typeof expenseCategorySchema>;