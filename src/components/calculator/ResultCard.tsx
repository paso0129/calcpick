interface ResultItem {
  label: string;
  value: string;
  highlight?: boolean;
  subtext?: string;
}

interface ResultCardProps {
  items: ResultItem[];
  title?: string;
}

export default function ResultCard({ items, title }: ResultCardProps) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4 sm:p-6">
      {title && (
        <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>
      )}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={`p-3 sm:p-4 rounded-lg ${
              item.highlight
                ? 'bg-accent-500/10 border border-accent-500/20'
                : 'bg-dark-elevated'
            }`}
          >
            <p className="text-text-tertiary text-[10px] sm:text-xs uppercase tracking-wider mb-1">
              {item.label}
            </p>
            <p className={`text-lg sm:text-2xl font-bold ${
              item.highlight ? 'text-accent-500' : 'text-text-primary'
            }`}>
              {item.value}
            </p>
            {item.subtext && (
              <p className="text-text-tertiary text-[10px] sm:text-xs mt-1">{item.subtext}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
