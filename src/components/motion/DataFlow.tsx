export function DataFlow({ reduced = false }: { reduced?: boolean }) {
  return (
    <div className="hero-data-flow" data-reduced={reduced} aria-hidden="true">
      <svg viewBox="0 0 520 220" fill="none" focusable="false">
        {Array.from({ length: 15 }, (_, index) => {
          const y = 12 + index * 14;
          const bend = 110 + index * 5;
          const end = 110 + (y - 110) * 0.6;
          const path = `M 4 ${y} H ${bend} L ${bend + 64} ${end} H 516`;
          return (
            <g key={index}>
              <path className="data-flow-track" d={path} />
              <path
                className="data-flow-pulse"
                d={path}
                pathLength={100}
                style={{ animationDelay: `${-index * 0.47}s`, animationDuration: `${4.8 + (index % 3) * 0.6}s` }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
