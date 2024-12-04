import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Bell, Edit, Trash } from 'lucide-react';
import { Goal } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { calculateGoalProgress, isGoalOnTrack, getProjectedCompletionDate } from '@/lib/goals';
import { format } from 'date-fns';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const progress = calculateGoalProgress(goal);
  const onTrack = isGoalOnTrack(goal);
  const projectedDate = getProjectedCompletionDate(goal);
  const hasAlerts = goal.alerts.some(alert => !alert.triggered);

  return (
    <Card className="p-4 relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">{goal.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{goal.category}</p>
        </div>
        <div className="flex items-center gap-2">
          {hasAlerts && (
            <Bell className="h-4 w-4 text-yellow-500 animate-pulse" />
          )}
          <Button variant="ghost" size="icon" onClick={() => onEdit(goal)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(goal.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Current</p>
            <p className="font-medium">{formatCurrency(goal.currentAmount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Target</p>
            <p className="font-medium">{formatCurrency(goal.targetAmount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Monthly Saving</p>
            <p className="font-medium">{formatCurrency(goal.monthlyContribution)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Target Date</p>
            <p className="font-medium">{format(new Date(goal.targetDate), 'MMM yyyy')}</p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className={onTrack ? 'text-green-500' : 'text-yellow-500'}>
              {onTrack ? 'On Track' : 'Behind Schedule'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Projected completion: {format(projectedDate, 'MMM yyyy')}
          </p>
        </div>
      </div>
    </Card>
  );
}