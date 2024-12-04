import { Budget, SavingsGoal } from '../types';

export interface SimulationState {
  budget: Budget;
  savingsGoal: SavingsGoal;
  scenarios: SimulationScenario[];
  activeScenarios: string[];
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  impact: number;
  timeReduction: number;
  apply: (state: SimulationState) => SimulationState;
}