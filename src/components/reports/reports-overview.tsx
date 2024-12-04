import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpendingTrends } from './spending-trends';
import { SavingsProgress } from './savings-progress';
import { CategoryBreakdown } from './category-breakdown';
import { YearlyComparison } from './yearly-comparison';

export function ReportsOverview() {
  return (
    <Card className="col-span-full rounded-none">
      <CardHeader>
        <CardTitle>Financial Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <SpendingTrends />
          <SavingsProgress />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <CategoryBreakdown />
          <YearlyComparison />
        </div>
      </CardContent>
    </Card>
  );
}