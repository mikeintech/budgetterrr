import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ExpenseCategories } from '../expense-categories';

interface ExpensesSectionProps {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export function ExpensesSection({ data, onChange }: ExpensesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(data).map(([category, value]) => (
          <div key={category} className="space-y-2">
            <Label htmlFor={category} className="capitalize">
              {category}
            </Label>
            <Input
              id={category}
              type="number"
              value={value}
              onChange={(e) => onChange(category, e.target.value)}
            />
          </div>
        ))}
      </div>

      <ExpenseCategories />
    </div>
  );
}