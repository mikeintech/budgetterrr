import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useData } from '@/lib/data-context';
import { formatCurrency } from '@/lib/utils';

export function BudgetSummary() {
  const { data } = useData();

  const totalBaseExpenses = Object.values(data.budget.expenses)
    .reduce((sum, amount) => sum + amount, 0);

  const totalCustomExpenses = data.budget.customExpenses
    ?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

  const totalExpenses = totalBaseExpenses + totalCustomExpenses;
  const remainingBudget = data.budget.income - totalExpenses - data.budget.targetSavings;

  if (!data.budget.income) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">Total Expenses:</p>
        <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">Monthly Savings:</p>
        <p className="text-2xl font-bold">{formatCurrency(data.budget.targetSavings)}</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">Remaining Budget:</p>
        <p className={`text-2xl font-bold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
          {formatCurrency(remainingBudget)}
        </p>
      </Card>
    </motion.div>
  );
}