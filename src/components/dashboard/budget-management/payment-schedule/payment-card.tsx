import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface PaymentCardProps {
  label: string;
  amount: number;
  sublabel: string;
  variant?: 'default' | 'success' | 'error';
}

export function PaymentCard({ label, amount, sublabel, variant = 'default' }: PaymentCardProps) {
  const getAmountClassName = () => {
    switch (variant) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return '';
    }
  };

  return (
    <Card className="p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-lg font-semibold ${getAmountClassName()}`}>
        {formatCurrency(amount)}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
    </Card>
  );
}