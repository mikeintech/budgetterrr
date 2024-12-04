import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AppSettingsProps {
  onClose: () => void;
}

export function AppSettings({ onClose }: AppSettingsProps) {
  const handleReset = () => {
    localStorage.clear();
    toast.success('Settings reset successfully. Refreshing page...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Reset Application</h3>
        <p className="text-sm text-muted-foreground">
          This will clear all your data and take you back to the onboarding process.
          This action cannot be undone.
        </p>
        <Button
          variant="destructive"
          onClick={handleReset}
          className="mt-2"
        >
          Reset Application
        </Button>
      </div>
    </div>
  );
}