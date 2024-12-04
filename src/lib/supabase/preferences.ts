import { supabase } from '../supabase';

export async function getOnboardingStatus(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('is_onboarded')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return false;
      }
      throw error;
    }

    return data?.is_onboarded || false;
  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    return false;
  }
}

export async function syncOnboardingStatus(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    const localStatus = localStorage.getItem('isOnboarded') === 'true';
    
    const { data, error } = await supabase
      .from('user_preferences')
      .select('is_onboarded')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    const remoteStatus = data?.is_onboarded || false;

    // If there's a mismatch, prefer the remote status
    if (localStatus !== remoteStatus) {
      localStorage.setItem('isOnboarded', remoteStatus.toString());
    }
  } catch (error) {
    console.error('Error syncing onboarding status:', error);
  }
}