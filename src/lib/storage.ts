import { UserData } from './types';
import { migrateStorage } from './storage-migration';
import { startOfMonth, addDays } from 'date-fns';

const STORAGE_KEY = 'budgetsmart_data';
const VERSION_KEY = 'budgetsmart_version';

export function saveUserData(data: Partial<UserData>) {
  const existingData = getUserData();
  const newData = { ...existingData, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
}

export function getUserData(): UserData {
  // Ensure storage is migrated before getting data
  migrateStorage();
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return getDefaultUserData();
  }

  const parsedData = JSON.parse(data);
  // Ensure goals array exists
  if (!parsedData.savingsGoal.goals) {
    parsedData.savingsGoal.goals = [];
  }
  return parsedData;
}

export function clearLocalData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(VERSION_KEY);
  localStorage.removeItem('isOnboarded');
}

export function getDefaultUserData(): UserData {
  const nextPayDate = startOfMonth(addDays(new Date(), 14));
  return {
    savingsGoal: {
      amount: 0,
      timeline: 12,
      startDate: new Date().toISOString(),
      currentAmount: 0,
      goals: [],
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