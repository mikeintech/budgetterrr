import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimeElapsed, formatDate } from './timeline-utils';

interface TimelineControlsProps {
  currentDate: Date;
  monthsElapsed: number;
  isPlaying: boolean;
  timeline: number;
  onPlayPause: () => void;
  onReset: () => void;
  onSkipForward: () => void;
  onSkipBack: () => void;
}

export function TimelineControls({
  currentDate,
  monthsElapsed,
  isPlaying,
  timeline,
  onPlayPause,
  onReset,
  onSkipForward,
  onSkipBack,
}: TimelineControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDate.toISOString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-2xl font-bold"
          >
            {formatDate(currentDate)}
          </motion.div>
        </AnimatePresence>
        <p className="text-sm text-muted-foreground">
          Time elapsed: {formatTimeElapsed(monthsElapsed)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onSkipBack}
          disabled={monthsElapsed <= 0}
          title="Back 1 month"
          className="relative group"
        >
          <SkipBack className="h-4 w-4" />
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            -1m
          </span>
        </Button>
        <Button variant="outline" size="icon" onClick={onPlayPause}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onSkipForward}
          disabled={monthsElapsed >= timeline}
          title="Forward 1 month"
          className="relative group"
        >
          <SkipForward className="h-4 w-4" />
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            +1m
          </span>
        </Button>
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}