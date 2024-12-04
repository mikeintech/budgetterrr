import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useData } from '@/lib/data-context';
import { ExpenseCategory } from '@/lib/types';
import { toast } from 'sonner';

export function MonthlyExpenses() {
  const { data, updateData } = useData();
  const [expenses, setExpenses] = useState({
    housing: (data.budget.expenses.housing || '0').toString(),
    transportation: (data.budget.expenses.transportation || '0').toString(),
    food: (data.budget.expenses.food || '0').toString(),
    utilities: (data.budget.expenses.utilities || '0').toString(),
    entertainment: (data.budget.expenses.entertainment || '0').toString(),
  });

  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [customExpenses, setCustomExpenses] = useState<ExpenseCategory[]>(
    data.budget.customExpenses || []
  );

  const handleExpenseChange = (category: string, value: string) => {
    setExpenses(prev => ({ ...prev, [category]: value }));
    updateData({
      budget: {
        ...data.budget,
        expenses: {
          ...data.budget.expenses,
          [category]: Number(value) || 0,
        },
      },
    });
  };

  const handleAddCustomExpense = () => {
    if (!newCategory.trim() || !newAmount.trim()) {
      toast.error('Please enter both category name and amount');
      return;
    }

    const amount = Number(newAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const newExpense: ExpenseCategory = {
      id: Date.now().toString(),
      name: newCategory.trim(),
      amount,
    };

    const updatedExpenses = [...customExpenses, newExpense];
    setCustomExpenses(updatedExpenses);
    setNewCategory('');
    setNewAmount('');

    updateData({
      budget: {
        ...data.budget,
        customExpenses: updatedExpenses,
      },
    });
  };

  const handleRemoveCustomExpense = (id: string) => {
    const updatedExpenses = customExpenses.filter(exp => exp.id !== id);
    setCustomExpenses(updatedExpenses);
    updateData({
      budget: {
        ...data.budget,
        customExpenses: updatedExpenses,
      },
    });
  };

  const handleUpdateCustomAmount = (id: string, amount: string) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 0) return;

    const updatedExpenses = customExpenses.map(exp =>
      exp.id === id ? { ...exp, amount: numAmount } : exp
    );
    setCustomExpenses(updatedExpenses);
    updateData({
      budget: {
        ...data.budget,
        customExpenses: updatedExpenses,
      },
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Expenses</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(expenses).map(([category, value], index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Label htmlFor={category} className="capitalize">
              {category}
            </Label>
            <Input
              id={category}
              type="number"
              placeholder={`Enter ${category} expenses`}
              value={value}
              onChange={(e) => handleExpenseChange(category, e.target.value)}
              className="mt-1"
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <h4 className="text-sm font-medium">Custom Expenses</h4>
        <div className="flex gap-2">
          <Input
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          <Button onClick={handleAddCustomExpense} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {customExpenses.map((expense) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Input
                value={expense.name}
                readOnly
                className="flex-grow"
              />
              <Input
                type="number"
                value={expense.amount}
                onChange={(e) => handleUpdateCustomAmount(expense.id, e.target.value)}
                className="w-32"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveCustomExpense(expense.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}