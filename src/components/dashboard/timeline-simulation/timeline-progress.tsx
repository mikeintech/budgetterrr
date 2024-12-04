import { motion } from 'framer-motion';

interface TimelineProgressProps {
  progress: number;
  isOnTrack: boolean;
}

export function TimelineProgress({ progress, isOnTrack }: TimelineProgressProps) {
  return (
    <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${isOnTrack ? 'bg-primary' : 'bg-yellow-500'}`}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}