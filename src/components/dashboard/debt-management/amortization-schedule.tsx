import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/lib/data-context';
import { DebtAccount, AmortizationEntry } from '@/lib/types';
import { calculateAmortizationSchedule, calculatePayoffDate, calculateTotalInterest } from '@/lib/calculations/debt';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

export function AmortizationSchedule() {
  const { data } = useData();
  const [selectedDebtId, setSelectedDebtId] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const selectedDebt = data.debts?.find(d => d.id === selectedDebtId);
  const schedule = selectedDebt ? calculateAmortizationSchedule(selectedDebt, paymentAmount || selectedDebt.minimumPayment) : [];
  const payoffDate = calculatePayoffDate(schedule);
  const totalInterest = calculateTotalInterest(schedule);

  const handleDebtSelect = (debtId: string) => {
    setSelectedDebtId(debtId);
    const debt = data.debts?.find(d => d.id === debtId);
    if (debt) {
      setPaymentAmount(debt.minimumPayment);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Select Account</Label>
            <Select value={selectedDebtId} onValueChange={handleDebtSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an account" />
              </SelectTrigger>
              <SelectContent>
                {data.debts?.map(debt => (
                  <SelectItem key={debt.id} value={debt.id}>
                    {debt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Monthly Payment</Label>
            <Input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              placeholder="Enter payment amount"
              min={selectedDebt?.minimumPayment}
            />
          </div>
        </div>

        {selectedDebt && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Payoff Date</p>
              <p className="text-lg font-semibold">
                {payoffDate ? format(payoffDate, 'MMM yyyy') : 'Never'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Interest</p>
              <p className="text-lg font-semibold">{formatCurrency(totalInterest)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-lg font-semibold">
                {formatCurrency(selectedDebt.balance + totalInterest)}
              </p>
            </div>
          </div>
        )}

        {schedule.length > 0 && (
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Remaining</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.slice(0, 24).map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(entry.date, 'MMM yyyy')}</TableCell>
                    <TableCell>{formatCurrency(entry.payment)}</TableCell>
                    <TableCell>{formatCurrency(entry.principal)}</TableCell>
                    <TableCell>{formatCurrency(entry.interest)}</TableCell>
                    <TableCell>{formatCurrency(entry.remainingBalance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Card>
  );
}