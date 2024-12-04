import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { UserData } from '@/lib/types';
import { processTimeBasedUpdates } from '@/lib/calculations/time';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface TestControlsProps {
  data: UserData;
  isUpdating: boolean;
  onUpdate: () => Promise<void>;
}

export function TestControls({ data, isUpdating, onUpdate }: TestControlsProps) {
  const [date, setDate] = useState<Date>();
  const [previewData, setPreviewData] = useState<UserData | null>(null);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      const testData = {
        ...data,
        budget: {
          ...data.budget,
          paySchedule: {
            ...data.budget.paySchedule,
            nextPayDate: newDate.toISOString(),
          },
        },
      };
      const updatedData = processTimeBasedUpdates(testData);
      setPreviewData(updatedData);
    } else {
      setPreviewData(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <Label>Custom Next Pay Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button 
          onClick={onUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? 'Processing...' : 'Trigger Update'}
        </Button>
      </div>

      {previewData && (
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <h4 className="font-medium">Preview Changes</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>New Cash Balance:</span>
              <span className="font-medium">{formatCurrency(previewData.budget.currentCash)}</span>
            </div>
            <div className="flex justify-between">
              <span>New Savings Balance:</span>
              <span className="font-medium">{formatCurrency(previewData.savingsGoal.currentAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Next Pay Date:</span>
              <span className="font-medium">{format(new Date(previewData.budget.paySchedule.nextPayDate), "PPP")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}