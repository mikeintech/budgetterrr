import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaySchedule } from '@/lib/types';

interface PayDateSelectorProps {
  paySchedule: PaySchedule;
  onPayDayChange: (field: keyof PaySchedule, value: number) => void;
}

export function PayDateSelector({ paySchedule, onPayDayChange }: PayDateSelectorProps) {
  if (paySchedule.frequency === 'monthly') {
    return (
      <div className="space-y-2">
        <Label htmlFor="payDay">What day of the month?</Label>
        <Select 
          value={paySchedule.firstPayDay?.toString()} 
          onValueChange={(value) => onPayDayChange('firstPayDay', parseInt(value))}
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
    );
  }

  if (paySchedule.frequency === 'semi_monthly') {
    return (
      <>
        <div className="space-y-2">
          <Label>First Pay Day</Label>
          <Select
            value={paySchedule.firstPayDay?.toString()}
            onValueChange={(value) => onPayDayChange('firstPayDay', parseInt(value))}
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
            onValueChange={(value) => onPayDayChange('secondPayDay', parseInt(value))}
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
    );
  }

  if (paySchedule.frequency === 'weekly' || paySchedule.frequency === 'biweekly') {
    return (
      <div className="space-y-2">
        <Label>Which day of the week?</Label>
        <Select
          value={paySchedule.dayOfWeek?.toString()}
          onValueChange={(value) => onPayDayChange('dayOfWeek', parseInt(value))}
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
    );
  }

  return null;
}