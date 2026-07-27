export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="silkscreen inline-flex items-center rounded-full border border-line bg-raised px-3 py-1">
      {children}
    </span>
  );
}
