interface StatCellProps {
  label: string;
  value: string;
}

export function StatCell({ label, value }: StatCellProps) {
  return (
    <div className="border-b border-border py-2.5">
      <div className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-fg-3">
        {label}
      </div>
      <div className="mt-0.75 text-sm font-semibold text-fg-1">{value}</div>
    </div>
  );
}
