import { Slider } from '@/components/ui/slider';
import { formatTimeElapsed } from './timeline-utils';

interface TimelineSliderProps {
  value: number;
  onChange: (value: number) => void;
  maxMonths: number;
}

export function TimelineSlider({ value, onChange, maxMonths }: TimelineSliderProps) {
  return (
    <div className="space-y-1">
      <Slider
        value={[value]}
        max={maxMonths}
        step={0.1}
        onValueChange={([newValue]) => onChange(newValue)}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Start</span>
        <span>{formatTimeElapsed(maxMonths)}</span>
      </div>
    </div>
  );
}