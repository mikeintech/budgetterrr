import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import { ExpenseCategory } from '@/lib/types';

interface CustomCategoryProps {
  expense: ExpenseCategory;
  maxAmount: number;
  percentage: number;
  index: number;
  onUpdate: (id: string, amount: number) => void;
  onRemove: (id: string) => void;
}

export function CustomCategory({
  expense,
  maxAmount,
  percentage,
  index,
  onUpdate,
  onRemove,
}: CustomCategoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label>{expense.name}</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[expense.amount]}
              max={maxAmount}
              step={100}
              onValueChange={([value]) => onUpdate(expense.id, value)}
              className="flex-1"
            />
            <Input
              type="number"
              value={expense.amount}
              onChange={(e) => onUpdate(expense.id, Number(e.target.value))}
              className="w-24"
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground w-20 text-right">
          {percentage.toFixed(1)}%
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(expense.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}