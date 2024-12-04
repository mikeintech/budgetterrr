import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/lib/data-context';
import { TimelineControls } from './timeline-controls';
import { TimelineProgress } from './timeline-progress';
import { TimelineSlider } from './timeline-slider';
import { TimelineMetrics } from './timeline-metrics';
import { useTimelineSimulation } from './use-timeline-simulation';

export function TimelineSimulation() {
  const { data } = useData();
  const [monthsElapsed, setMonthsElapsed] = useState(0);
  const simulation = useTimelineSimulation(data, monthsElapsed);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Timeline Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <TimelineControls
            currentDate={simulation.currentDate}
            monthsElapsed={monthsElapsed}
            isPlaying={simulation.isPlaying}
            onPlayPause={simulation.handlePlayPause}
            onReset={simulation.handleReset}
            onSkipForward={simulation.handleSkipForward}
            onSkipBack={simulation.handleSkipBack}
            timeline={data.savingsGoal.timeline}
          />

          <TimelineProgress
            progress={simulation.progress}
            isOnTrack={simulation.isOnTrack}
          />

          <TimelineSlider
            value={monthsElapsed}
            onChange={setMonthsElapsed}
            maxMonths={data.savingsGoal.timeline}
          />

          <TimelineMetrics
            projectedSavings={simulation.projectedSavings}
            monthlySavingsRate={simulation.monthlySavingsRate}
            monthlyGoal={simulation.monthlyGoal}
            projectedCompletionDate={simulation.projectedCompletionDate}
            progress={simulation.progress}
            isOnTrack={simulation.isOnTrack}
            currentAmount={data.budget.currentCash}
            goalAmount={data.savingsGoal.amount}
          />
        </div>
      </CardContent>
    </Card>
  );
}