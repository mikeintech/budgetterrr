import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { SimulationState } from '@/lib/simulation/types';
import { applyScenario } from '@/lib/simulation/calculations';
import { toast } from 'sonner';

interface SimulationScenariosProps {
  simulationState: SimulationState;
  onStateChange: (newState: SimulationState) => void;
}

export function SimulationScenarios({ 
  simulationState,
  onStateChange 
}: SimulationScenariosProps) {
  const handleApplyScenario = (scenarioId: string) => {
    if (simulationState.activeScenarios.includes(scenarioId)) {
      toast.error('This scenario has already been applied');
      return;
    }

    const newState = applyScenario(simulationState, scenarioId);
    onStateChange(newState);
    toast.success('Scenario applied successfully');
  };

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Optimization Scenarios</h3>
      <div className="space-y-4">
        {simulationState.scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{scenario.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {scenario.description}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleApplyScenario(scenario.id)}
                disabled={simulationState.activeScenarios.includes(scenario.id)}
              >
                {simulationState.activeScenarios.includes(scenario.id) 
                  ? 'Applied' 
                  : 'Apply'}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p className="text-muted-foreground">Annual Impact</p>
                <p className="font-medium text-green-500">
                  +{formatCurrency(scenario.impact)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Time Saved</p>
                <p className="font-medium">
                  {scenario.timeReduction} months faster
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}