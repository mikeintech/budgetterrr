import { Button } from '@/components/ui/button';
import { BUDGET_TEMPLATES, TemplateType } from './templates';

interface TemplateButtonsProps {
  selectedTemplate: TemplateType | null;
  onTemplateSelect: (template: TemplateType) => void;
}

export function TemplateButtons({ selectedTemplate, onTemplateSelect }: TemplateButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button 
        variant={selectedTemplate === 'savings-focused' ? 'secondary' : 'outline'} 
        size="sm"
        onClick={() => onTemplateSelect('savings-focused')}
      >
        Savings Focus
      </Button>
      <Button 
        variant={selectedTemplate === 'balanced' ? 'secondary' : 'outline'}
        size="sm"
        onClick={() => onTemplateSelect('balanced')}
      >
        Balanced
      </Button>
      <Button 
        variant={selectedTemplate === 'debt-payoff' ? 'secondary' : 'outline'}
        size="sm"
        onClick={() => onTemplateSelect('debt-payoff')}
      >
        Debt Payoff
      </Button>
    </div>
  );
}