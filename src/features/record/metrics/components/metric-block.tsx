interface MetricBlockProps {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
}

export function MetricBlock({ label, value, unit, sub }: MetricBlockProps) {
  return (
    <div className="border-b border-border py-4">
      <div className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-fg-3">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="font-sans text-[32px] font-bold leading-none text-fg-1">
          {value}
        </span>
        {unit && <span className="font-mono text-xs text-fg-3">{unit}</span>}
      </div>
      {sub && <div className="mt-0.5 font-mono text-3xs text-fg-4">{sub}</div>}
    </div>
  );
}
