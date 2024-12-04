import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useData } from '@/lib/data-context';

export function SavingsProgress() {
  const { data: { savingsGoal } } = useData();
  const progress = (savingsGoal.currentAmount / savingsGoal.amount) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Goal Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progress} />
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-muted-foreground">Current</p>
              <p className="text-xl font-bold">
                ${savingsGoal.currentAmount.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Goal</p>
              <p className="text-xl font-bold">${savingsGoal.amount.toFixed(2)}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {progress.toFixed(1)}% of goal achieved
          </p>
        </div>
      </CardContent>
    </Card>
  );
}