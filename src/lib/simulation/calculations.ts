import { SimulationState, SimulationScenario } from './types';
import { formatCurrency } from '../utils';

export function createInitialSimulationState(
  budget: Budget,
  savingsGoal: SavingsGoal
): SimulationState {
  return {
    budget: { ...budget },
    savingsGoal: { ...savingsGoal },
    scenarios: generateScenarios(budget),
    activeScenarios: [],
  };
}

function generateScenarios(budget: Budget): SimulationScenario[] {
  const monthlyIncome = budget.income;
  const currentSavings = budget.targetSavings;
  const currentExpenses = Object.values(budget.expenses)
    .reduce((sum, amount) => sum + amount, 0);

  return [
    {
      id: 'aggressive-savings',
      name: 'Aggressive Savings',
      description: 'Increase savings rate by 20%',
      impact: currentSavings * 0.2 * 12,
      timeReduction: 3,
      apply: (state: SimulationState) => ({
        ...state,
        budget: {
          ...state.budget,
          targetSavings: Math.round(state.budget.targetSavings * 1.2),
        },
      }),
    },
    {
      id: 'expense-reduction',
      name: 'Expense Reduction',
      description: 'Cut non-essential expenses by 15%',
      impact: currentExpenses * 0.15 * 12,
      timeReduction: 2,
      apply: (state: SimulationState) => ({
        ...state,
        budget: {
          ...state.budget,
          expenses: Object.entries(state.budget.expenses).reduce((acc, [category, amount]) => {
            const reduction = ['entertainment', 'food'].includes(category) ? 0.85 : 1;
            acc[category] = Math.round(amount * reduction);
            return acc;
          }, {} as Record<string, number>),
        },
      }),
    },
    {
      id: 'income-boost',
      name: 'Income Boost',
      description: 'Side hustle or promotion',
      impact: monthlyIncome * 0.1 * 12,
      timeReduction: 1.5,
      apply: (state: SimulationState) => ({
        ...state,
        budget: {
          ...state.budget,
          income: Math.round(state.budget.income * 1.1),
          paySchedule: {
            ...state.budget.paySchedule,
            amount: state.budget.paySchedule.amount * 1.1,
          },
        },
      }),
    },
  ];
}

export function applyScenario(
  state: SimulationState,
  scenarioId: string
): SimulationState {
  const scenario = state.scenarios.find(s => s.id === scenarioId);
  if (!scenario) return state;

  const newState = scenario.apply(state);
  return {
    ...newState,
    activeScenarios: [...state.activeScenarios, scenarioId],
  };
}

export function calculateProjectedSavings(state: SimulationState): number {
  const { budget } = state;
  const monthlyExpenses = Object.values(budget.expenses)
    .reduce((sum, amount) => sum + amount, 0);
  return (budget.income - monthlyExpenses - budget.targetSavings) * 12;
}

export function calculateTimeToGoal(state: SimulationState): number {
  const { budget, savingsGoal } = state;
  const monthlyContribution = budget.targetSavings;
  if (monthlyContribution <= 0) return Infinity;
  
  const remaining = savingsGoal.amount - savingsGoal.currentAmount;
  return Math.ceil(remaining / monthlyContribution);
}