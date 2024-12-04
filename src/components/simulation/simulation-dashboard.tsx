import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimulationControls } from './simulation-controls';
import { SimulationChart } from './simulation-chart';
import { SimulationScenarios } from './simulation-scenarios';
import { SimulationMetrics } from './simulation-metrics';
import { useData } from '@/lib/data-context';
import { createInitialSimulationState } from '@/lib/simulation/calculations';
import { SimulationState } from '@/lib/simulation/types';

export function SimulationDashboard() {
  const { data } = useData();
  const [simulationState, setSimulationState] = useState<SimulationState>(() => 
    createInitialSimulationState(data.budget, data.savingsGoal)
  );

  // Reset simulation when actual data changes
  useEffect(() => {
    setSimulationState(createInitialSimulationState(data.budget, data.savingsGoal));
  }, [data.budget, data.savingsGoal]);

  return (
    <Card className="col-span-full rounded-none">
      <CardHeader>
        <CardTitle>Financial Simulation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <SimulationControls 
          simulationState={simulationState}
          onStateChange={setSimulationState}
        />
        <SimulationChart simulationState={simulationState} />
        <div className="grid gap-6 md:grid-cols-2">
          <SimulationScenarios 
            simulationState={simulationState}
            onStateChange={setSimulationState}
          />
          <SimulationMetrics simulationState={simulationState} />
        </div>
      </CardContent>
    </Card>
  );
}