import { motion } from 'framer-motion';
import { Income } from './income';
import { SavingsTarget } from './savings-target';
import { MonthlyExpenses } from './monthly-expenses';
import { BudgetSummary } from './budget-summary';

export function BudgetSetup() {
  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold tracking-tight mb-6"
      >
        Set Up Your Budget
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-8"
      >
        <Income />
        <SavingsTarget />
        <MonthlyExpenses />
        <BudgetSummary />
      </motion.div>
    </div>
  );
}