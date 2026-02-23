interface ComparisonItem {
  label: string;
  values: string[];
  highlight?: number; // index of the better value
}

interface ComparisonPanelProps {
  headers: string[];
  items: ComparisonItem[];
  title?: string;
}

export default function ComparisonPanel({ headers, items, title }: ComparisonPanelProps) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
      {title && (
        <div className="p-4 border-b border-dark-border">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left text-text-tertiary font-medium px-4 py-3" />
              {headers.map((header, i) => (
                <th key={i} className="text-right text-text-tertiary font-medium px-4 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-dark-border/50">
                <td className="px-4 py-3 text-text-secondary font-medium">{item.label}</td>
                {item.values.map((value, i) => (
                  <td
                    key={i}
                    className={`px-4 py-3 text-right ${
                      item.highlight === i ? 'text-success-500 font-semibold' : 'text-text-primary'
                    }`}
                  >
                    {value}
                    {item.highlight === i && ' ✓'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
