export function TagList({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <ul aria-label={label} className="tag-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
