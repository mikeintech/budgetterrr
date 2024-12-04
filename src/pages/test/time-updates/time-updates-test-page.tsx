import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrentState } from './components/current-state';
import { ProjectedUpdates } from './components/projected-updates';
import { TestControls } from './components/test-controls';
import { useData } from '@/lib/data-context';

export function TimeUpdatesTestPage() {
  const { data, refreshData } = useData();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await refreshData();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="col-span-full rounded-none">
      <CardHeader>
        <CardTitle>Time Updates Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <CurrentState data={data} />
          <ProjectedUpdates data={data} />
        </div>

        <TestControls 
          data={data}
          isUpdating={isUpdating}
          onUpdate={handleUpdate}
        />

        <div className="text-sm text-muted-foreground">
          <p>Note: This test panel is only available in development mode.</p>
          <p>Updates are processed locally and will affect the current session data.</p>
        </div>
      </CardContent>
    </Card>
  );
}