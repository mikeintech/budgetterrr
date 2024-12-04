import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useBudget } from '@/lib/budget-context';
import { formatCurrency } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function SpendingBreakdown() {
  const { localBudget } = useBudget();
  
  // Prepare category data
  const categoryData = [
    ...Object.entries(localBudget.expenses).map(([category, amount]) => ({
      name: category,
      value: amount,
    })),
    ...(localBudget.customExpenses?.map(exp => ({
      name: exp.name,
      value: exp.amount,
    })) || []),
  ].filter(item => item.value > 0);

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0);

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Spending Breakdown</h3>
            <p className="text-sm text-muted-foreground">
              Total: {formatCurrency(totalExpenses)}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        className="transition-all duration-200 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => label}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {categoryData.map(({ name, value }, index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="capitalize">{name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{formatCurrency(value)}</span>
                      <span className="text-xs">
                        ({((value / totalExpenses) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={(value / totalExpenses) * 100}
                    className="h-2"
                    indicatorClassName={`bg-[${COLORS[index % COLORS.length]}]`}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}