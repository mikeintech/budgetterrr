import { useState, useCallback, useEffect } from 'react';
import { Budget } from '@/lib/types';
import { useData } from '@/lib/data-context';

interface BudgetChange {
  type: 'expense' | 'savings';
  category: string;
  oldValue: number;
  newValue: number;
}

// Deep clone helper to ensure proper state immutability
function deepCloneBudget(budget: Budget): Budget {
  return {
    ...budget,
    expenses: { ...budget.expenses },
    customExpenses: budget.customExpenses?.map(exp => ({ ...exp })) || [],
    paySchedule: { ...budget.paySchedule },
  };
}

export function useBudgetState() {
  const { data, updateData } = useData();
  const [initialBudget, setInitialBudget] = useState<Budget>(deepCloneBudget(data.budget));
  const [localBudget, setLocalBudget] = useState<Budget>(deepCloneBudget(data.budget));
  const [pendingChanges, setPendingChanges] = useState<BudgetChange[]>([]);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

  // Update initial budget when data changes
  useEffect(() => {
    const clonedBudget = deepCloneBudget(data.budget);
    setInitialBudget(clonedBudget);
    setLocalBudget(clonedBudget);
    setPendingChanges([]);
  }, [data.budget]);

  const updateLocalBudget = useCallback((updates: Partial<Budget>) => {
    setLocalBudget(prev => {
      const newBudget = deepCloneBudget(prev);
      
      if (updates.expenses) {
        newBudget.expenses = {
          ...newBudget.expenses,
          ...updates.expenses,
        };
      }
      
      if (updates.targetSavings !== undefined) {
        newBudget.targetSavings = updates.targetSavings;
      }
      
      if (updates.customExpenses) {
        newBudget.customExpenses = updates.customExpenses;
      }
      
      if (updates.income !== undefined) {
        newBudget.income = updates.income;
      }
      
      if (updates.paySchedule) {
        newBudget.paySchedule = {
          ...newBudget.paySchedule,
          ...updates.paySchedule,
        };
      }

      return newBudget;
    });

    if (autoSaveEnabled) {
      updateData({ budget: updates });
    }
  }, [autoSaveEnabled, updateData]);

  const trackChange = useCallback((change: BudgetChange) => {
    setPendingChanges(prev => [
      ...prev.filter(c => !(c.type === change.type && c.category === change.category)),
      change
    ]);
  }, []);

  const saveChanges = useCallback(() => {
    const budgetToSave = deepCloneBudget(localBudget);
    updateData({ budget: budgetToSave });
    setInitialBudget(budgetToSave);
    setPendingChanges([]);
  }, [localBudget, updateData]);

  const discardChanges = useCallback(() => {
    const restoredBudget = deepCloneBudget(initialBudget);
    setLocalBudget(restoredBudget);
    setPendingChanges([]);
  }, [initialBudget]);

  return {
    localBudget,
    initialBudget,
    pendingChanges,
    autoSaveEnabled,
    updateLocalBudget,
    trackChange,
    saveChanges,
    discardChanges,
    setAutoSaveEnabled,
  };
}