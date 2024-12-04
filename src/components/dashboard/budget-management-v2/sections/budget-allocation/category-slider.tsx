import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useEffect, useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface CategorySliderProps {
  label: string;
  amount: number;
  maxAmount: number;
  percentage: number;
  index: number;
  onChange: (value: number) => void;
}

export function CategorySlider({ 
  label, 
  amount, 
  maxAmount, 
  percentage,
  index,
  onChange 
}: CategorySliderProps) {
  const [localValue, setLocalValue] = useState(amount);
  const [isDragging, setIsDragging] = useState(false);

  // Update local value when prop changes and not dragging
  useEffect(() => {
    if (!isDragging) {
      setLocalValue(amount);
    }
  }, [amount, isDragging]);

  // Debounced change handler
  const debouncedOnChange = useDebouncedCallback(
    (value: number) => {
      onChange(value);
    },
    200
  );

  // Handle slider change
  const handleSliderChange = useCallback((values: number[]) => {
    const newValue = values[0];
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  }, [debouncedOnChange]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue)) {
      setLocalValue(newValue);
      debouncedOnChange(newValue);
    }
  }, [debouncedOnChange]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label className="capitalize">{label}</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[localValue]}
              max={maxAmount}
              step={100}
              onValueChange={handleSliderChange}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              className="flex-1"
            />
            <Input
              type="number"
              value={localValue}
              onChange={handleInputChange}
              className="w-24"
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground w-20 text-right">
          {percentage.toFixed(1)}%
        </div>
      </div>
    </motion.div>
  );
}