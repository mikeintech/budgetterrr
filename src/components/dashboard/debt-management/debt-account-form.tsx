import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/lib/data-context';
import { DebtAccount } from '@/lib/types';
import { getDebtTypeLabel } from '@/lib/calculations/debt';
import { toast } from 'sonner';

export function DebtAccountForm() {
  const { data, updateData } = useData();
  const [newDebt, setNewDebt] = useState<Partial<DebtAccount>>({
    name: '',
    balance: 0,
    interestRate: 0,
    minimumPayment: 0,
    type: 'credit_card'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDebt.name || !newDebt.balance || !newDebt.interestRate || !newDebt.minimumPayment) {
      toast.error('Please fill in all fields');
      return;
    }

    const debt: DebtAccount = {
      id: Date.now().toString(),
      name: newDebt.name,
      balance: Number(newDebt.balance),
      interestRate: Number(newDebt.interestRate),
      minimumPayment: Number(newDebt.minimumPayment),
      type: newDebt.type as DebtAccount['type']
    };

    updateData({
      debts: [...(data.debts || []), debt]
    });

    setNewDebt({
      name: '',
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
      type: 'credit_card'
    });

    toast.success('Debt account added successfully');
  };

  const debtTypes: DebtAccount['type'][] = [
    'credit_card',
    'student_loan',
    'car_loan',
    'personal_loan',
    'mortgage',
    'other'
  ];

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              value={newDebt.name}
              onChange={(e) => setNewDebt(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Chase Credit Card"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Account Type</Label>
            <Select
              value={newDebt.type}
              onValueChange={(value) => setNewDebt(prev => ({ ...prev, type: value as DebtAccount['type'] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {debtTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {getDebtTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Current Balance</Label>
            <Input
              id="balance"
              type="number"
              value={newDebt.balance || ''}
              onChange={(e) => setNewDebt(prev => ({ ...prev, balance: Number(e.target.value) }))}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              value={newDebt.interestRate || ''}
              onChange={(e) => setNewDebt(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumPayment">Minimum Monthly Payment</Label>
            <Input
              id="minimumPayment"
              type="number"
              value={newDebt.minimumPayment || ''}
              onChange={(e) => setNewDebt(prev => ({ ...prev, minimumPayment: Number(e.target.value) }))}
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Add Debt Account
        </Button>
      </form>
    </Card>
  );
}