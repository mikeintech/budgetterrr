import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/lib/data-context';
import { useState } from 'react';
import { PaySchedule } from '@/lib/types';
import { addDays, format, getDate, startOfMonth } from 'date-fns';

export function IncomeAndAssets() {
  const { data, updateData } = useData();
  const [paySchedule, setPaySchedule] = useState<PaySchedule>({
    ...data.budget.paySchedule,
    amount: data.budget.income,
  });

  const handleFrequencyChange = (frequency: PaySchedule['frequency']) => {
    const nextPayDate = startOfMonth(addDays(new Date(), 14));
    setPaySchedule(prev => ({
      ...prev,
      frequency,
      nextPayDate: nextPayDate.toISOString(),
      // Reset specific fields based on frequency
      dayOfWeek: undefined,
      firstPayDay: frequency === 'monthly' ? getDate(nextPayDate) : undefined,
      secondPayDay: undefined,
    }));

    // Update the budget with the new pay schedule
    updateData({
      budget: {
        ...data.budget,
        paySchedule: {
          ...data.budget.paySchedule,
          frequency,
          nextPayDate: nextPayDate.toISOString(),
        },
        // Calculate monthly income based on frequency and amount
        income: calculateMonthlyIncome(frequency, paySchedule.amount),
      },
    });
  };

  const handleAmountChange = (amount: string) => {
    const numAmount = Number(amount) || 0;
    setPaySchedule(prev => ({
      ...prev,
      amount: numAmount,
    }));

    // Update the budget with the new amount
    updateData({
      budget: {
        ...data.budget,
        paySchedule: {
          ...data.budget.paySchedule,
          amount: numAmount,
        },
        income: calculateMonthlyIncome(paySchedule.frequency, numAmount),
      },
    });
  };

  const calculateMonthlyIncome = (frequency: PaySchedule['frequency'], amount: number): number => {
    switch (frequency) {
      case 'weekly':
        return amount * 52 / 12;
      case 'biweekly':
        return amount * 26 / 12;
      case 'semi_monthly':
        return amount * 24 / 12;
      case 'monthly':
      default:
        return amount;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Income & Pay Schedule</h3>
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="payFrequency">How often do you get paid?</Label>
            <Select 
              value={paySchedule.frequency} 
              onValueChange={(value) => handleFrequencyChange(value as PaySchedule['frequency'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Every Two Weeks</SelectItem>
                <SelectItem value="semi_monthly">Twice a Month (15th/30th)</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payAmount">
              {paySchedule.frequency === 'monthly' ? 'Monthly' : 'Per Paycheck'} Amount
            </Label>
            <Input
              id="payAmount"
              type="number"
              placeholder="Enter amount"
              value={paySchedule.amount || ''}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
            {paySchedule.frequency !== 'monthly' && (
              <p className="text-sm text-muted-foreground">
                Monthly Income: ${calculateMonthlyIncome(paySchedule.frequency, paySchedule.amount).toFixed(2)}
              </p>
            )}
          </div>

          {paySchedule.frequency === 'monthly' && (
            <div className="space-y-2">
              <Label htmlFor="payDay">What day of the month?</Label>
              <Select 
                value={paySchedule.firstPayDay?.toString()} 
                onValueChange={(value) => {
                  const day = parseInt(value);
                  setPaySchedule(prev => ({
                    ...prev,
                    firstPayDay: day,
                  }));
                  updateData({
                    budget: {
                      ...data.budget,
                      paySchedule: {
                        ...data.budget.paySchedule,
                        firstPayDay: day,
                      },
                    },
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {paySchedule.frequency === 'semi_monthly' && (
            <>
              <div className="space-y-2">
                <Label>First Pay Day</Label>
                <Select
                  value={paySchedule.firstPayDay?.toString()}
                  onValueChange={(value) => {
                    const day = parseInt(value);
                    setPaySchedule(prev => ({
                      ...prev,
                      firstPayDay: day,
                    }));
                    updateData({
                      budget: {
                        ...data.budget,
                        paySchedule: {
                          ...data.budget.paySchedule,
                          firstPayDay: day,
                        },
                      },
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select first pay day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 15 }, (_, i) => i + 1).map(day => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Second Pay Day</Label>
                <Select
                  value={paySchedule.secondPayDay?.toString()}
                  onValueChange={(value) => {
                    const day = parseInt(value);
                    setPaySchedule(prev => ({
                      ...prev,
                      secondPayDay: day,
                    }));
                    updateData({
                      budget: {
                        ...data.budget,
                        paySchedule: {
                          ...data.budget.paySchedule,
                          secondPayDay: day,
                        },
                      },
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select second pay day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 16 }, (_, i) => i + 15).map(day => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {(paySchedule.frequency === 'weekly' || paySchedule.frequency === 'biweekly') && (
            <div className="space-y-2">
              <Label>Which day of the week?</Label>
              <Select
                value={paySchedule.dayOfWeek?.toString()}
                onValueChange={(value) => {
                  const day = parseInt(value);
                  setPaySchedule(prev => ({
                    ...prev,
                    dayOfWeek: day,
                  }));
                  updateData({
                    budget: {
                      ...data.budget,
                      paySchedule: {
                        ...data.budget.paySchedule,
                        dayOfWeek: day,
                      },
                    },
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="nextPayDate">Next Pay Date</Label>
            <Input
              id="nextPayDate"
              type="date"
              value={format(new Date(paySchedule.nextPayDate), 'yyyy-MM-dd')}
              onChange={(e) => {
                const date = new Date(e.target.value);
                setPaySchedule(prev => ({
                  ...prev,
                  nextPayDate: date.toISOString(),
                }));
                updateData({
                  budget: {
                    ...data.budget,
                    paySchedule: {
                      ...data.budget.paySchedule,
                      nextPayDate: date.toISOString(),
                    },
                  },
                });
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}