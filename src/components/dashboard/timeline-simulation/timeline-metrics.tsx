import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatDate } from './timeline-utils';

interface TimelineMetricsProps {
  projectedSavings: number;
  monthlySavingsRate: number;
  monthlyGoal: number;
  projectedCompletionDate: Date;
  progress: number;
  isOnTrack: boolean;
  currentAmount: number;
  goalAmount: number;
}

export function TimelineMetrics({
  projectedSavings,
  monthlySavingsRate,
  monthlyGoal,
  projectedCompletionDate,
  progress,
  isOnTrack,
  currentAmount,
  goalAmount,
}: TimelineMetricsProps) {
  return (
    <div className="space-y-4">
      {/* Savings Goal Card */}
      <Card className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm text-muted-foreground">Overall Savings Goal</p>
            <p className="text-lg font-semibold">{formatCurrency(goalAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Current Progress</p>
            <p className="text-lg font-semibold">{progress.toFixed(1)}%</p>
          </div>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 mt-2">
          <div
            className={`rounded-full h-2 transition-all duration-300 ${
              isOnTrack ? 'bg-primary' : 'bg-yellow-500'
            }`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Current: {formatCurrency(currentAmount)}</span>
          <span>Goal: {formatCurrency(goalAmount)}</span>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={projectedSavings}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center"
              >
                <p className="text-sm text-muted-foreground mb-1">
                  Projected Savings
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(Math.max(0, projectedSavings))}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isOnTrack ? 'On track' : 'Behind schedule'}
                </p>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Monthly Savings Rate
              </p>
              <p className="text-2xl font-bold">{formatCurrency(monthlySavingsRate)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Need {formatCurrency(monthlyGoal)} per month
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Projected Completion
              </p>
              <p className="text-2xl font-bold">{formatDate(projectedCompletionDate)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {progress.toFixed(1)}% of goal
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}