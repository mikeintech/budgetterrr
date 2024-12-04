import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Goal, GoalCategory } from '@/lib/types';
import { GOAL_CATEGORIES } from '@/lib/goals';

const goalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string(),
  targetAmount: z.number().min(0.01, 'Target amount must be greater than 0'),
  monthlyContribution: z.number().min(0, 'Monthly contribution must be positive'),
  priority: z.enum(['low', 'medium', 'high']),
  autoSave: z.boolean(),
});

interface GoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (goal: Partial<Goal>) => void;
  initialData?: Goal;
}

export function GoalForm({ open, onOpenChange, onSubmit, initialData }: GoalFormProps) {
  const [targetDate, setTargetDate] = useState<Date>(
    initialData ? new Date(initialData.targetDate) : new Date()
  );

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || 'other',
      targetAmount: initialData?.targetAmount || 0,
      monthlyContribution: initialData?.monthlyContribution || 0,
      priority: initialData?.priority || 'medium',
      autoSave: initialData?.autoSave || false,
    },
  });

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      targetDate: targetDate.toISOString(),
      id: initialData?.id || Date.now().toString(),
      currentAmount: initialData?.currentAmount || 0,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      alerts: initialData?.alerts || [],
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              defaultValue={initialData?.category || 'other'}
              onValueChange={(value) => register('category').onChange({ target: { value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {GOAL_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount</Label>
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              {...register('targetAmount', { valueAsNumber: true })}
            />
            {errors.targetAmount && (
              <p className="text-sm text-destructive">{errors.targetAmount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
            <Input
              id="monthlyContribution"
              type="number"
              step="0.01"
              {...register('monthlyContribution', { valueAsNumber: true })}
            />
            {errors.monthlyContribution && (
              <p className="text-sm text-destructive">{errors.monthlyContribution.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Target Date</Label>
            <Calendar
              mode="single"
              selected={targetDate}
              onSelect={(date) => date && setTargetDate(date)}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              defaultValue={initialData?.priority || 'medium'}
              onValueChange={(value) => register('priority').onChange({ target: { value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="autoSave">Enable Auto-Save</Label>
            <Switch
              id="autoSave"
              defaultChecked={initialData?.autoSave}
              onCheckedChange={(checked) =>
                register('autoSave').onChange({ target: { value: checked } })
              }
            />
          </div>

          <Button type="submit" className="w-full">
            {initialData ? 'Update Goal' : 'Create Goal'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}