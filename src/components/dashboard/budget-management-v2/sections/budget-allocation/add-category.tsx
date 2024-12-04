import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddCategoryProps {
  newCategory: string;
  newAmount: string;
  onCategoryChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onAdd: () => void;
}

export function AddCategory({
  newCategory,
  newAmount,
  onCategoryChange,
  onAmountChange,
  onAdd,
}: AddCategoryProps) {
  return (
    <div className="flex gap-4 pt-2">
      <Input
        placeholder="Category name"
        value={newCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Amount"
        value={newAmount}
        onChange={(e) => onAmountChange(e.target.value)}
      />
      <Button onClick={onAdd} size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}