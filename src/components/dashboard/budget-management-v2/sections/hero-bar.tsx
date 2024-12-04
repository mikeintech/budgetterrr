import { motion } from 'framer-motion';
import { Wallet, PiggyBank, ShoppingCart } from 'lucide-react';
import { useBudget } from '@/lib/budget-context';
import { formatCurrency } from '@/lib/utils';

export function HeroBar() {
  const { localBudget } = useBudget();
  const { paySchedule } = localBudget;

  // Calculate total expenses
  const baseExpenses = Object.values(localBudget.expenses).reduce((sum, amount) => sum + amount, 0);
  const customExpenses = localBudget.customExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const totalExpenses = baseExpenses + customExpenses;

  // Calculate per-paycheck amounts
  const perPaycheckExpenses = (() => {
    switch (paySchedule.frequency) {
      case 'weekly':
        return totalExpenses / 4.33;
      case 'biweekly':
        return totalExpenses / 2.17;
      case 'semi_monthly':
        return totalExpenses / 2;
      case 'monthly':
      default:
        return totalExpenses;
    }
  })();

  const perPaycheckSavings = (() => {
    switch (paySchedule.frequency) {
      case 'weekly':
        return localBudget.targetSavings / 4.33;
      case 'biweekly':
        return localBudget.targetSavings / 2.17;
      case 'semi_monthly':
        return localBudget.targetSavings / 2;
      case 'monthly':
      default:
        return localBudget.targetSavings;
    }
  })();

  const remainingAmount = paySchedule.amount - perPaycheckExpenses - perPaycheckSavings;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-green-500/10 p-3">
            <Wallet className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ending Cash</p>
            <p className={`text-2xl font-bold ${remainingAmount < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {formatCurrency(remainingAmount)}
            </p>
            <p className="text-xs text-muted-foreground">per paycheck</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-blue-500/10 p-3">
            <PiggyBank className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Savings</p>
            <p className="text-2xl font-bold text-blue-500">
              {formatCurrency(perPaycheckSavings)}
            </p>
            <p className="text-xs text-muted-foreground">per paycheck</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="relative overflow-hidden rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-red-500/10 p-3">
            <ShoppingCart className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Expenses</p>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(perPaycheckExpenses)}
            </p>
            <p className="text-xs text-muted-foreground">per paycheck</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}