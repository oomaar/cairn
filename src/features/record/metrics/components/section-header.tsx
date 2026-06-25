interface SectionHeaderProps {
  children: React.ReactNode;
}

export function SectionHeader({ children }: SectionHeaderProps) {
  return (
    <div className="mb-1 mt-7 font-mono text-[10.5px] uppercase tracking-eyebrow text-(--record-margin) opacity-70 first:mt-0">
      {children}
    </div>
  );
}
