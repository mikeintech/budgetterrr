import { useState, useEffect, useRef } from 'react';
import { addMonths, startOfMonth, isValid } from 'date-fns';
import { UserData } from '@/lib/types';
import { 
  calculateProjectedSavings,
  calculateMonthlySavingsRate,
  calculateMonthlyGoal,
  calculateProgress,
  getProjectedCompletionDate 
} from '@/lib/calculations';

export function useTimelineSimulation(data: UserData, monthsElapsed: number) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date(data.savingsGoal.startDate)));
  const animationRef = useRef<number>();

  const monthlySavingsRate = calculateMonthlySavingsRate(data);
  const monthlyGoal = calculateMonthlyGoal(data.savingsGoal.amount, data.savingsGoal.timeline);
  const projectedSavings = calculateProjectedSavings(data, monthsElapsed);
  const progress = calculateProgress(projectedSavings, data.savingsGoal.amount);
  const isOnTrack = monthlySavingsRate >= monthlyGoal;
  const projectedCompletionDate = getProjectedCompletionDate(
    currentDate,
    data.savingsGoal.amount,
    monthlySavingsRate
  );

  useEffect(() => {
    const newDate = addMonths(startOfMonth(new Date(data.savingsGoal.startDate)), Math.floor(monthsElapsed));
    if (isValid(newDate)) {
      setCurrentDate(newDate);
    }
  }, [monthsElapsed, data.savingsGoal.startDate]);

  const animate = () => {
    setMonthsElapsed((prev) => {
      const next = prev + 0.1;
      if (next >= data.savingsGoal.timeline) {
        setIsPlaying(false);
        return data.savingsGoal.timeline;
      }
      return next;
    });
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, monthsElapsed]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleReset = () => {
    setMonthsElapsed(0);
    setCurrentDate(startOfMonth(new Date(data.savingsGoal.startDate)));
    setIsPlaying(false);
  };

  const handleSkipForward = () => {
    setMonthsElapsed((prev) => Math.min(prev + 1, data.savingsGoal.timeline));
  };

  const handleSkipBack = () => {
    setMonthsElapsed((prev) => Math.max(prev - 1, 0));
  };

  return {
    currentDate,
    isPlaying,
    monthlySavingsRate,
    monthlyGoal,
    projectedSavings,
    progress,
    isOnTrack,
    projectedCompletionDate,
    handlePlayPause,
    handleReset,
    handleSkipForward,
    handleSkipBack,
  };
}