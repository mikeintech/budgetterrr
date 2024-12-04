import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/lib/data-context';
import { Goal } from '@/lib/types';
import { GoalCard } from './goal-card';
import { GoalForm } from './goal-form';
import { GoalsSummary } from './goals-summary';

export function GoalsOverview() {
  const { data, updateData } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>();

  const handleSubmit = (goal: Partial<Goal>) => {
    const currentGoals = data.savingsGoal.goals || [];
    const updatedGoals = selectedGoal
      ? currentGoals.map(g => g.id === selectedGoal.id ? { ...g, ...goal } : g)
      : [...currentGoals, goal as Goal];

    updateData({
      savingsGoal: {
        ...data.savingsGoal,
        goals: updatedGoals,
      },
    });

    setSelectedGoal(undefined);
  };

  const handleEdit = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsFormOpen(true);
  };

  const handleDelete = (goalId: string) => {
    const currentGoals = data.savingsGoal.goals || [];
    const updatedGoals = currentGoals.filter(g => g.id !== goalId);
    updateData({
      savingsGoal: {
        ...data.savingsGoal,
        goals: updatedGoals,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Financial Goals</h2>
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <GoalsSummary />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data.savingsGoal.goals || []).map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <GoalForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setSelectedGoal(undefined);
        }}
        onSubmit={handleSubmit}
        initialData={selectedGoal}
      />
    </div>
  );
}