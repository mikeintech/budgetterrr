import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect} from 'react';

interface AutoSaveBannerProps {
  changes: {
    type: 'expense' | 'savings';
    category: string;
    oldValue: number;
    newValue: number;
  }[];
  onSave: () => void;
  onDiscard: () => void;
  onAutoSaveChange: (enabled: boolean) => void;
  autoSaveEnabled: boolean;
}

export function AutoSaveBanner({
  changes,
  onSave,
  onDiscard,
  onAutoSaveChange,
  autoSaveEnabled,
}: AutoSaveBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (changes.length > 0) {
      setIsVisible(true);
    }
  }, [changes]);

  if (!isVisible || changes.length === 0) return null;

  // Calculate net change by summing the differences between new and old values
  const totalChange = changes.reduce((sum, change) => {
    const difference = change.newValue - change.oldValue;
    return sum + difference;
  }, 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-auto px-4 z-50"
      >
        <div className="bg-card border shadow-lg rounded-lg p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Save className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Unsaved Changes</p>
                <p className="text-sm text-muted-foreground">
                  Net change: {formatCurrency(totalChange)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={autoSaveEnabled}
                  onCheckedChange={onAutoSaveChange}
                />
                <span className="text-sm">Auto-save</span>
              </div>
              
              {!autoSaveEnabled && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onDiscard();
                      setIsVisible(false);
                    }}
                  >
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      onSave();
                      setIsVisible(false);
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVisible(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}