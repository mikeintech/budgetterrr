import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Budget } from './types';
import { useData } from './data-context';

interface BudgetChange {
  type: 'expense' | 'savings';
  category: string;
  oldValue: number;
  newValue: number;
}

interface BudgetContextType {
  localBudget: Budget;
  updateLocalBudget: (updates: Partial<Budget> & { change?: BudgetChange }) => void;
  saveChanges: () => void;
  discardChanges: () => void;
  pendingChanges: BudgetChange[];
  autoSaveEnabled: boolean;
  setAutoSaveEnabled: (enabled: boolean) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Deep clone helper to ensure proper state immutability
function deepCloneBudget(budget: Budget): Budget {
  return {
    ...budget,
    expenses: { ...budget.expenses },
    customExpenses: budget.customExpenses?.map(exp => ({ ...exp })) || [],
    paySchedule: { ...budget.paySchedule },
  };
}

export function BudgetProvider({ children }: { children: React.ReactNode }) {
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

  const updateLocalBudget = useCallback((updates: Partial<Budget> & { change?: BudgetChange }) => {
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

      if (autoSaveEnabled) {
        updateData({ budget: newBudget });
      }

      return newBudget;
    });

    // Track changes if not in auto-save mode
    if (!autoSaveEnabled && updates.change) {
      setPendingChanges(prev => [
        ...prev.filter(c => !(c.type === updates.change!.type && c.category === updates.change!.category)),
        updates.change
      ]);
    }
  }, [autoSaveEnabled, updateData]);

  const saveChanges = useCallback(() => {
    updateData({ budget: localBudget });
    setInitialBudget(deepCloneBudget(localBudget));
    setPendingChanges([]);
  }, [localBudget, updateData]);

  const discardChanges = useCallback(() => {
    const restoredBudget = deepCloneBudget(initialBudget);
    setLocalBudget(restoredBudget);
    setPendingChanges([]);
  }, [initialBudget]);

  return (
    <BudgetContext.Provider value={{
      localBudget,
      updateLocalBudget,
      saveChanges,
      discardChanges,
      pendingChanges,
      autoSaveEnabled,
      setAutoSaveEnabled,
    }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}