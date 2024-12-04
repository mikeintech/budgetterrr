import { PaySchedule } from '@/lib/types';

export const BUDGET_TEMPLATES = {
  'savings-focused': {
    savings: 0.3, // 30% savings
    housing: 0.25,
    transportation: 0.15,
    food: 0.15,
    utilities: 0.1,
    entertainment: 0.05,
  },
  'balanced': {
    savings: 0.2, // 20% savings
    housing: 0.3,
    transportation: 0.15,
    food: 0.15,
    utilities: 0.1,
    entertainment: 0.1,
  },
  'debt-payoff': {
    savings: 0.4, // 40% for debt/savings
    housing: 0.25,
    transportation: 0.1,
    food: 0.15,
    utilities: 0.05,
    entertainment: 0.05,
  },
} as const;

export type TemplateType = keyof typeof BUDGET_TEMPLATES;