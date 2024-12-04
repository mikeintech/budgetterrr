import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ExpenseCategory } from '@/lib/types';
import { toast } from 'sonner';
import { BUDGET_TEMPLATES, TemplateType } from './templates';
import { TemplateButtons } from './template-buttons';
import { CategorySlider } from './category-slider';
import { CustomCategory } from './custom-category';
import { AddCategory } from './add-category';
import { BudgetSummary } from './budget-summary';
import { AutoSaveBanner } from './auto-save-banner';
import { useBudget } from '@/lib/budget-context';

export function BudgetAllocation() {
  const {
    localBudget,
    updateLocalBudget,
    saveChanges,
    discardChanges,
    pendingChanges,
    autoSaveEnabled,
    setAutoSaveEnabled
  } = useBudget();
  
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);

  const totalIncome = localBudget.income;
  const totalExpenses = Object.values(localBudget.expenses).reduce((sum, amount) => sum + amount, 0) +
    (localBudget.customExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0);
  const totalAllocation = totalExpenses + localBudget.targetSavings;
  const remainingBudget = totalIncome - totalAllocation;

  const handleCategoryChange = (category: string, value: number) => {
    const oldValue = localBudget.expenses[category];
    const updatedExpenses = {
      ...localBudget.expenses,
      [category]: value,
    };

    updateLocalBudget({
      expenses: updatedExpenses,
      change: {
        type: 'expense',
        category,
        oldValue,
        newValue: value
      }
    });
  };

  const handleSavingsChange = (value: number) => {
    const oldValue = localBudget.targetSavings;
    updateLocalBudget({
      targetSavings: value,
      change: {
        type: 'savings',
        category: 'savings',
        oldValue,
        newValue: value
      }
    });
  };

  const handleAddCustomCategory = () => {
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

    const updatedExpenses = [...(localBudget.customExpenses || []), newExpense];
    updateLocalBudget({ customExpenses: updatedExpenses });

    setNewCategory('');
    setNewAmount('');
    toast.success('Category added successfully');
  };

  const handleUpdateCustomCategory = (id: string, amount: number) => {
    const updatedExpenses = localBudget.customExpenses?.map(exp =>
      exp.id === id ? { ...exp, amount } : exp
    );
    updateLocalBudget({ customExpenses: updatedExpenses });
  };

  const handleRemoveCustomCategory = (id: string) => {
    const updatedExpenses = localBudget.customExpenses?.filter(exp => exp.id !== id);
    updateLocalBudget({ customExpenses: updatedExpenses });
    toast.success('Category removed successfully');
  };

  const applyTemplate = (template: TemplateType) => {
    setSelectedTemplate(template);
    const templateRatios = BUDGET_TEMPLATES[template];
    const updatedBudget = { ...localBudget };
    const changes: BudgetChange[] = [];
    
    Object.entries(templateRatios).forEach(([category, ratio]) => {
      const newValue = Math.round(totalIncome * ratio);
      
      if (category === 'savings') {
        changes.push({
          type: 'savings',
          category: 'savings',
          oldValue: localBudget.targetSavings,
          newValue
        });
        updatedBudget.targetSavings = newValue;
      } else {
        changes.push({
          type: 'expense',
          category,
          oldValue: localBudget.expenses[category],
          newValue
        });
        updatedBudget.expenses[category] = newValue;
      }
    });

    // Apply all changes at once
    changes.forEach(change => {
      updateLocalBudget({
        ...updatedBudget,
        change
      });
    });

    if (autoSaveEnabled) {
      toast.success('Template applied successfully');
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Budget Allocation</h3>
            <TemplateButtons
              selectedTemplate={selectedTemplate}
              onTemplateSelect={applyTemplate}
            />
          </div>

          <div className="space-y-4">
            {Object.entries(localBudget.expenses).map(([category, amount], index) => (
              <CategorySlider
                key={category}
                label={category}
                amount={amount}
                maxAmount={totalIncome}
                percentage={(amount / totalIncome) * 100}
                index={index}
                onChange={(value) => handleCategoryChange(category, value)}
              />
            ))}

            {localBudget.customExpenses?.map((expense, index) => (
              <CustomCategory
                key={expense.id}
                expense={expense}
                maxAmount={totalIncome}
                percentage={(expense.amount / totalIncome) * 100}
                index={index + Object.keys(localBudget.expenses).length}
                onUpdate={handleUpdateCustomCategory}
                onRemove={handleRemoveCustomCategory}
              />
            ))}

            <AddCategory
              newCategory={newCategory}
              newAmount={newAmount}
              onCategoryChange={setNewCategory}
              onAmountChange={setNewAmount}
              onAdd={handleAddCustomCategory}
            />

            <CategorySlider
              label="Monthly Savings Target"
              amount={localBudget.targetSavings}
              maxAmount={totalIncome}
              percentage={(localBudget.targetSavings / totalIncome) * 100}
              index={Object.keys(localBudget.expenses).length + 1}
              onChange={handleSavingsChange}
            />

            <BudgetSummary
              totalAllocation={totalAllocation}
              totalIncome={totalIncome}
              remainingBudget={remainingBudget}
            />
          </div>
        </div>
      </Card>

      <AutoSaveBanner
        changes={pendingChanges}
        onSave={saveChanges}
        onDiscard={discardChanges}
        onAutoSaveChange={setAutoSaveEnabled}
        autoSaveEnabled={autoSaveEnabled}
      />
    </>
  );
}