import { ReactNode } from 'react';

interface CalculatorFormProps {
  children: ReactNode;
  onSubmit?: () => void;
}

export default function CalculatorForm({ children }: CalculatorFormProps) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}
