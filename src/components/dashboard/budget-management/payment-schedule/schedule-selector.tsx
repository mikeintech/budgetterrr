import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Schedule } from '@/lib/types';

interface ScheduleSelectorProps {
  schedule: Schedule;
  onScheduleChange: (value: Schedule) => void;
}

export function ScheduleSelector({ schedule, onScheduleChange }: ScheduleSelectorProps) {
  return (
    <Select value={schedule} onValueChange={(value) => onScheduleChange(value as Schedule)}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="monthly">Monthly</SelectItem>
        <SelectItem value="semi-monthly">Semi-monthly (15th/30th)</SelectItem>
        <SelectItem value="biweekly">Bi-weekly</SelectItem>
        <SelectItem value="weekly">Weekly</SelectItem>
      </SelectContent>
    </Select>
  );
}