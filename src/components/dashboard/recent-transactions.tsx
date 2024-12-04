import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useData } from '@/lib/data-context';

export function RecentTransactions() {
  const { data: { transactions } } = useData();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(new Date(transaction.date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="capitalize">{transaction.category}</TableCell>
                <TableCell className={`text-right ${
                  transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
                }`}>
                  {transaction.type === 'expense' ? '-' : '+'}$
                  {transaction.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}