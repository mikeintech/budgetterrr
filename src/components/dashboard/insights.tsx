import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/lib/data-context';
import { Lightbulb } from 'lucide-react';

export function Insights() {
  const { data: { budget, transactions, savingsGoal } } = useData();

  const generateInsights = () => {
    const insights = [];
    
    // Calculate monthly savings needed
    const monthlyTarget = savingsGoal.amount / savingsGoal.timeline;
    const currentMonthSavings = transactions
      .filter((t) => {
        const date = new Date(t.date);
        const now = new Date();
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);

    if (currentMonthSavings < monthlyTarget) {
      insights.push({
        type: 'warning',
        message: `You're $${(monthlyTarget - currentMonthSavings).toFixed(
          2
        )} away from your monthly savings goal.`,
      });
    }

    // Add more insights based on spending patterns
    const recentExpenses = transactions
      .filter((t) => t.type === 'expense')
      .slice(0, 10);

    const categories = recentExpenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const highestCategory = Object.entries(categories).sort(
      ([, a], [, b]) => b - a
    )[0];

    if (highestCategory) {
      insights.push({
        type: 'info',
        message: `Your highest spending category is ${
          highestCategory[0]
        } at $${highestCategory[1].toFixed(2)}.`,
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Smart Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                insight.type === 'warning'
                  ? 'bg-yellow-100 dark:bg-yellow-900/20'
                  : 'bg-blue-100 dark:bg-blue-900/20'
              }`}
            >
              <p className="text-sm">{insight.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}