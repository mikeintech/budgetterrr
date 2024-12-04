import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BudgetSetup } from './budget-setup/index';
import { useAuth } from '@/components/auth/auth-provider';
import { supabase } from '@/lib/supabase';

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Save onboarding state to Supabase
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          is_onboarded: true,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Save to local storage
      localStorage.setItem('isOnboarded', 'true');
      
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding state:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-2xl p-8">
          <div className="flex justify-center mb-8">
            <div className="p-3 rounded-full bg-primary/10">
              <Coins className="w-8 h-8 text-primary" />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <BudgetSetup />
          </motion.div>

          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleComplete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Complete Setup'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}