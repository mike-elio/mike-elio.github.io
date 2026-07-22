export function AnimatedBackground({ reduced }: { reduced: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="animated-background"
      data-motion={reduced ? "reduced" : "full"}
    >
      {Array.from({ length: 6 }, (_, index) => (
        <span
          className={`ambient-bubble ambient-bubble--${index + 1}`}
          key={index}
        />
      ))}
    </div>
  );
}
