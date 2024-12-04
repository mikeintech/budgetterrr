import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useData } from '@/lib/data-context';
import { ExpenseCategory } from '@/lib/types';
import { toast } from 'sonner';

export function ExpenseCategories() {
  const { data, updateData } = useData();
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const handleAddCategory = () => {
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

    const updatedExpenses = [...(data.budget.customExpenses || []), newExpense];

    updateData({
      budget: {
        ...data.budget,
        customExpenses: updatedExpenses,
      },
    });

    setNewCategory('');
    setNewAmount('');
    toast.success('Category added successfully');
  };

  const handleRemoveCategory = (id: string) => {
    const updatedExpenses = data.budget.customExpenses.filter(exp => exp.id !== id);
    updateData({
      budget: {
        ...data.budget,
        customExpenses: updatedExpenses,
      },
    });
    toast.success('Category removed successfully');
  };

  const handleUpdateAmount = (id: string, amount: string) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 0) return;

    const updatedExpenses = data.budget.customExpenses.map(exp =>
      exp.id === id ? { ...exp, amount: numAmount } : exp
    );

    updateData({
      budget: {
        ...data.budget,
        customExpenses: updatedExpenses,
      },
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Custom Expense Categories</h3>
      <div className="space-y-2">
        {data.budget.customExpenses?.map((expense) => (
          <div key={expense.id} className="flex items-center gap-2">
            <Input
              value={expense.name}
              readOnly
              className="flex-grow"
            />
            <Input
              type="number"
              value={expense.amount}
              onChange={(e) => handleUpdateAmount(expense.id, e.target.value)}
              className="w-32"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveCategory(expense.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
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
        <Button onClick={handleAddCategory} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      
    </div>
  );
}