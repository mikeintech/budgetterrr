import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { calculateRequiredMonthlyTarget, isMonthlyTargetSufficient } from '@/lib/calculations/goals';
import { useData } from '@/lib/data-context';

interface SavingsGoalCardProps {
  currentAmount: number;
  goalAmount: number;
}

export function SavingsGoalCard({ currentAmount, goalAmount }: SavingsGoalCardProps) {
  const { data } = useData();
  const monthlyTarget = data.budget.targetSavings;
  const timeline = data.savingsGoal.timeline;
  
  // Calculate current progress including monthly target
  const currentWithMonthlyTarget = currentAmount + monthlyTarget;
  const progressPercentage = goalAmount > 0 
    ? (currentWithMonthlyTarget / goalAmount) * 100 
    : 0;
    
  // Calculate total projected amount including all future monthly targets
  const totalProjected = currentAmount + (monthlyTarget * timeline);
  const projectedPercentage = goalAmount > 0 
    ? (totalProjected / goalAmount) * 100 
    : 0;
  
  const remainingAmount = Math.max(0, goalAmount - currentWithMonthlyTarget);
  const requiredMonthly = calculateRequiredMonthlyTarget(
    currentWithMonthlyTarget,
    goalAmount,
    timeline
  );
  
  const isOnTrack = isMonthlyTargetSufficient(
    monthlyTarget,
    currentWithMonthlyTarget,
    goalAmount,
    timeline
  );

  return (
    <Card className="p-4">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-1">Current Progress</p>
        <div className="flex items-baseline gap-2">
          <p className={`text-2xl font-bold ${isOnTrack ? 'text-primary' : 'text-yellow-500'}`}>
            {formatCurrency(currentWithMonthlyTarget)}
          </p>
          <p className="text-sm text-muted-foreground">
            ({formatCurrency(currentAmount)} + {formatCurrency(monthlyTarget)}/mo)
          </p>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Projected: {formatCurrency(totalProjected)} in {timeline} months
        </p>
      </div>

      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm text-muted-foreground">Goal Amount</p>
          <p className="text-lg font-semibold">{formatCurrency(goalAmount)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Progress with Monthly Savings</p>
          <p className="text-lg font-semibold">{progressPercentage.toFixed(1)}%</p>
        </div>
      </div>

      <div className="relative w-full h-2 bg-secondary rounded-full mt-2">
        {/* Current progress including monthly target */}
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${
            isOnTrack ? 'bg-primary' : 'bg-yellow-500'
          }`}
          style={{ width: `${Math.min(100, progressPercentage)}%` }}
        />
        {/* Future projected progress */}
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 bg-primary/30`}
          style={{ width: `${Math.min(100, projectedPercentage)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>Projected: {projectedPercentage.toFixed(1)}%</span>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground mt-4">
        <div>
          <div>Remaining: {formatCurrency(remainingAmount)}</div>
          <div className="mt-1">Required: {formatCurrency(requiredMonthly)}/mo</div>
        </div>
        <div className="text-right">
          <div>Timeline: {timeline} months</div>
          <div className="mt-1">
            Status: {isOnTrack ? 'On Track' : 'Behind Schedule'}
          </div>
        </div>
      </div>
    </Card>
  );
}
