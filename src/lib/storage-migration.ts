import { UserData, PaySchedule, Budget, SavingsGoal } from './types';
import { startOfMonth, addDays } from 'date-fns';

const STORAGE_KEY = 'budgetsmart_data';
const LEGACY_STORAGE_KEY = 'savesmart_data';
const VERSION_KEY = 'budgetsmart_version';
const CURRENT_VERSION = 2;

function isValidPaySchedule(data: any): data is PaySchedule {
  return (
    data &&
    typeof data === 'object' &&
    'frequency' in data &&
    typeof data.frequency === 'string' &&
    ['weekly', 'biweekly', 'semi_monthly', 'monthly'].includes(data.frequency) &&
    'nextPayDate' in data &&
    typeof data.nextPayDate === 'string' &&
    'amount' in data &&
    typeof data.amount === 'number'
  );
}

function isValidBudget(data: any): data is Budget {
  return (
    data &&
    typeof data === 'object' &&
    'income' in data &&
    typeof data.income === 'number' &&
    'expenses' in data &&
    typeof data.expenses === 'object' &&
    'customExpenses' in data &&
    Array.isArray(data.customExpenses) &&
    'targetSavings' in data &&
    typeof data.targetSavings === 'number' &&
    'currentCash' in data &&
    typeof data.currentCash === 'number' &&
    'paySchedule' in data &&
    isValidPaySchedule(data.paySchedule) &&
    'expenseAllocation' in data &&
    typeof data.expenseAllocation === 'string' &&
    ['evenly', 'first_check', 'last_check', 'custom'].includes(data.expenseAllocation)
  );
}

function isValidSavingsGoal(data: any): data is SavingsGoal {
  return (
    data &&
    typeof data === 'object' &&
    'amount' in data &&
    typeof data.amount === 'number' &&
    'timeline' in data &&
    typeof data.timeline === 'number' &&
    'startDate' in data &&
    typeof data.startDate === 'string' &&
    'currentAmount' in data &&
    typeof data.currentAmount === 'number'
  );
}

function isValidUserData(data: any): data is UserData {
  return (
    data &&
    typeof data === 'object' &&
    'budget' in data &&
    isValidBudget(data.budget) &&
    'savingsGoal' in data &&
    isValidSavingsGoal(data.savingsGoal) &&
    'transactions' in data &&
    Array.isArray(data.transactions) &&
    'debts' in data &&
    Array.isArray(data.debts)
  );
}

function getDefaultUserData(): UserData {
  const nextPayDate = startOfMonth(addDays(new Date(), 14));
  return {
    savingsGoal: {
      amount: 0,
      timeline: 12,
      startDate: new Date().toISOString(),
      currentAmount: 0,
    },
    budget: {
      income: 0,
      targetSavings: 0,
      currentCash: 0,
      expenses: {
        housing: 0,
        transportation: 0,
        food: 0,
        utilities: 0,
        entertainment: 0,
      },
      customExpenses: [],
      paySchedule: {
        frequency: 'monthly',
        firstPayDay: 1,
        nextPayDate: nextPayDate.toISOString(),
        amount: 0
      },
      expenseAllocation: 'evenly'
    },
    transactions: [],
    debts: [],
  };
}

function migrateFromV1(oldData: any): UserData {
  const defaultData = getDefaultUserData();
  
  try {
    // Attempt to preserve existing data while ensuring new fields are added
    return {
      ...defaultData,
      savingsGoal: {
        ...defaultData.savingsGoal,
        ...(isValidSavingsGoal(oldData?.savingsGoal) ? oldData.savingsGoal : {}),
      },
      budget: {
        ...defaultData.budget,
        ...(isValidBudget(oldData?.budget) ? oldData.budget : {}),
        expenses: {
          ...defaultData.budget.expenses,
          ...(oldData?.budget?.expenses || {}),
        },
        customExpenses: Array.isArray(oldData?.budget?.customExpenses) 
          ? oldData.budget.customExpenses 
          : [],
        expenseAllocation: oldData?.budget?.expenseAllocation || 'evenly',
      },
      transactions: Array.isArray(oldData?.transactions) ? oldData.transactions : [],
      debts: Array.isArray(oldData?.debts) ? oldData.debts : [],
    };
  } catch {
    return defaultData;
  }
}

export function migrateStorage() {
  // Check current version
  const version = Number(localStorage.getItem(VERSION_KEY)) || 1;
  
  if (version === CURRENT_VERSION) {
    return;
  }

  // Handle legacy data
  if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }

  // Get current data
  let currentData: UserData | null = null;
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      
      if (version === 1) {
        currentData = migrateFromV1(parsedData);
      }
    }
  } catch {
    currentData = null;
  }

  // If migration failed or no data exists, use default
  if (!currentData || !isValidUserData(currentData)) {
    currentData = getDefaultUserData();
  }

  // Save migrated data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
  localStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
}