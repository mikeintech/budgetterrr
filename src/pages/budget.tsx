import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BudgetManagement } from '@/components/dashboard/budget-management';
import { BudgetManagementV2 } from '@/components/dashboard/budget-management-v2';

export function BudgetPage() {
  const [version, setVersion] = useState<'v1' | 'v2'>('v1');

  return (
    <div className="space-y-4">
      <div className="flex justify-end px-4">
        <div className="inline-flex rounded-lg border bg-card p-1">
          <Button
            variant={version === 'v1' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setVersion('v1')}
          >
            Classic
          </Button>
          <Button
            variant={version === 'v2' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setVersion('v2')}
          >
            Modern
          </Button>
        </div>
      </div>

      {version === 'v1' ? <BudgetManagement /> : <BudgetManagementV2 />}
    </div>
  );
}