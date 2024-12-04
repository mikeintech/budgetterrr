import { useState } from 'react';
import { PaySchedule } from '@/lib/types';
import { PayFrequency } from './pay-frequency';
import { PayAmount } from './pay-amount';
import { PayDateSelector } from './pay-date-selector';
import { calculateMonthlyIncome } from './utils';
import { format, parse } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface IncomeSetupProps {
  initialPaySchedule: PaySchedule;
  onChange?: (schedule: PaySchedule, monthlyIncome: number) => void;
  onSave?: (schedule: PaySchedule, monthlyIncome: number) => void;
  autoSave?: boolean;
}

export function IncomeSetup({ 
  initialPaySchedule, 
  onChange,
  onSave,
  autoSave = false 
}: IncomeSetupProps) {
  const [paySchedule, setPaySchedule] = useState<PaySchedule>(initialPaySchedule);
  const [date, setDate] = useState<Date>(new Date(paySchedule.nextPayDate));

  const handleFrequencyChange = (frequency: PaySchedule['frequency']) => {
    const updatedSchedule = {
      ...paySchedule,
      frequency,
      dayOfWeek: undefined,
      firstPayDay: undefined,
      secondPayDay: undefined,
    };

    setPaySchedule(updatedSchedule);
    const monthlyIncome = calculateMonthlyIncome(frequency, updatedSchedule.amount);
    
    if (autoSave && onSave) {
      onSave(updatedSchedule, monthlyIncome);
    }
    if (onChange) {
      onChange(updatedSchedule, monthlyIncome);
    }
  };

  const handleAmountChange = (amount: string) => {
    const numAmount = Number(amount) || 0;
    const updatedSchedule = {
      ...paySchedule,
      amount: numAmount,
    };

    setPaySchedule(updatedSchedule);
    const monthlyIncome = calculateMonthlyIncome(updatedSchedule.frequency, numAmount);

    if (autoSave && onSave) {
      onSave(updatedSchedule, monthlyIncome);
    }
    if (onChange) {
      onChange(updatedSchedule, monthlyIncome);
    }
  };

  const handlePayDayChange = (field: keyof PaySchedule, value: number) => {
    const updatedSchedule = {
      ...paySchedule,
      [field]: value,
    };

    setPaySchedule(updatedSchedule);
    const monthlyIncome = calculateMonthlyIncome(updatedSchedule.frequency, updatedSchedule.amount);

    if (autoSave && onSave) {
      onSave(updatedSchedule, monthlyIncome);
    }
    if (onChange) {
      onChange(updatedSchedule, monthlyIncome);
    }
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return;
    
    setDate(newDate);
    const updatedSchedule = {
      ...paySchedule,
      nextPayDate: newDate.toISOString(),
    };

    setPaySchedule(updatedSchedule);
    const monthlyIncome = calculateMonthlyIncome(updatedSchedule.frequency, updatedSchedule.amount);

    if (autoSave && onSave) {
      onSave(updatedSchedule, monthlyIncome);
    }
    if (onChange) {
      onChange(updatedSchedule, monthlyIncome);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PayFrequency
        frequency={paySchedule.frequency}
        onFrequencyChange={handleFrequencyChange}
      />

      <PayAmount
        amount={paySchedule.amount}
        frequency={paySchedule.frequency}
        onAmountChange={handleAmountChange}
      />

      <PayDateSelector
        paySchedule={paySchedule}
        onPayDayChange={handlePayDayChange}
      />

      <div className="space-y-2">
        <Label>Next Pay Date</Label>
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
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}