import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserData } from './types';
import { getUserData, saveUserData } from './storage';
import { processTimeBasedUpdates } from './calculations/time';
import { useAuth } from '@/components/auth/auth-provider';
import { 
  saveUserDataToSupabase, 
  getUserDataFromSupabase,
  initializeUserData 
} from './supabase/data-service';

interface DataContextType {
  data: UserData;
  updateData: (newData: Partial<UserData>) => void;
  refreshData: () => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<UserData>(getUserData);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data when component mounts or user changes
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        if (user) {
          const userData = await initializeUserData();
          if (userData) {
            const updatedData = processTimeBasedUpdates(userData);
            setData(updatedData);
            // Save processed data back if it was updated
            if (updatedData !== userData) {
              await saveUserDataToSupabase(updatedData);
              saveUserData(updatedData);
            }
          }
        } else {
          const localData = getUserData();
          const updatedData = processTimeBasedUpdates(localData);
          setData(updatedData);
          if (updatedData !== localData) {
            saveUserData(updatedData);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Process time-based updates periodically
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const updatedData = processTimeBasedUpdates(data);
        if (updatedData !== data) {
          setData(updatedData);
          saveUserData(updatedData);
          if (user) {
            await saveUserDataToSupabase(updatedData).catch(console.error);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        handleVisibilityChange();
      }
    }, 60000); // Check every minute

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [data, user]);

  const updateData = useCallback(async (newData: Partial<UserData>) => {
    setData((currentData) => {
      const updatedData = {
        ...currentData,
        savingsGoal: {
          ...currentData.savingsGoal,
          ...(newData.savingsGoal || {}),
        },
        budget: {
          ...currentData.budget,
          ...(newData.budget || {}),
          expenses: {
            ...currentData.budget.expenses,
            ...(newData.budget?.expenses || {}),
          },
          customExpenses: newData.budget?.customExpenses || currentData.budget.customExpenses || [],
        },
        transactions: newData.transactions || currentData.transactions,
        debts: newData.debts || currentData.debts || [],
      };
      
      saveUserData(updatedData);
      if (user) {
        saveUserDataToSupabase(updatedData).catch(console.error);
      }
      return updatedData;
    });
  }, [user]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user) {
        const remoteData = await getUserDataFromSupabase();
        if (remoteData) {
          const updatedData = processTimeBasedUpdates(remoteData);
          setData(updatedData);
          if (updatedData !== remoteData) {
            saveUserData(updatedData);
            await saveUserDataToSupabase(updatedData);
          }
        }
      } else {
        const localData = getUserData();
        const updatedData = processTimeBasedUpdates(localData);
        setData(updatedData);
        if (updatedData !== localData) {
          saveUserData(updatedData);
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <DataContext.Provider value={{ data, updateData, refreshData, isLoading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}