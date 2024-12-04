import { supabase } from '../supabase';
import { UserData } from '../types';
import { getUserData, getDefaultUserData } from '../storage';

export async function saveUserDataToSupabase(data: UserData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    // First check if the user data exists
    const { data: existingData, error: fetchError } = await supabase
      .from('user_data')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw fetchError;
    }

    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from('user_data')
        .update({
          data: data,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
    } else {
      // Insert new record
      const { error } = await supabase
        .from('user_data')
        .insert({
          user_id: user.id,
          data: data,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error saving data to Supabase:', error);
    throw error;
  }
}

export async function getUserDataFromSupabase(): Promise<UserData | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('data')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null;
      }
      throw error;
    }
    
    return data?.data || null;
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    return null;
  }
}

export async function initializeUserData(): Promise<UserData> {
  const remoteData = await getUserDataFromSupabase();
  if (remoteData) {
    // Ensure we have all required fields
    const defaultData = getDefaultUserData();
    const mergedData = {
      ...defaultData,
      ...remoteData,
      savingsGoal: {
        ...defaultData.savingsGoal,
        ...remoteData.savingsGoal,
        goals: remoteData.savingsGoal.goals || [],
      },
      budget: {
        ...defaultData.budget,
        ...remoteData.budget,
        expenses: {
          ...defaultData.budget.expenses,
          ...remoteData.budget.expenses,
        },
        customExpenses: remoteData.budget.customExpenses || [],
      },
    };
    return mergedData;
  }

  // If no remote data exists, use default data
  const defaultData = getDefaultUserData();
  await saveUserDataToSupabase(defaultData);
  return defaultData;
}