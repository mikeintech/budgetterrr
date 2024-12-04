import { Layout } from './layout';
import { BudgetManagement } from './budget-management';
import { DebtManagement } from './debt-management';

export function Dashboard() {
  return (
    <Layout>
      <div className="mx-auto space-y-6">
        <BudgetManagement />
        <DebtManagement />
      </div>
    </Layout>
  );
}