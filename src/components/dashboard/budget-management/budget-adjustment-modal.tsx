import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BudgetAdjuster } from './budget-adjuster';

interface BudgetAdjustmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BudgetAdjustmentModal({ open, onOpenChange }: BudgetAdjustmentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adjust Budget</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <BudgetAdjuster onClose={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}