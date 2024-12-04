import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useData } from '@/lib/data-context';
import { formatCurrency } from '@/lib/utils';
import { calculateGoalProgress, isGoalOnTrack } from '@/lib/goals';

export function GoalsSummary() {
  const { data } = useData();
  const goals = data.savingsGoal.goals || [];

  // Calculate total progress across all goals
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  // Calculate total monthly contributions
  const totalMonthlyContribution = goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);

  // Get goals status
  const onTrackGoals = goals.filter(goal => isGoalOnTrack(goal)).length;
  const totalGoals = goals.length;

  if (goals.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Overall Progress</h3>
          <div className="mt-2 space-y-2">
            <Progress value={totalProgress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency(totalCurrentAmount)}</span>
              <span>{formatCurrency(totalTargetAmount)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Monthly Contribution</p>
            <p className="text-lg font-semibold">{formatCurrency(totalMonthlyContribution)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Goals Status</p>
            <p className="text-lg font-semibold">
              {onTrackGoals}/{totalGoals} On Track
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}