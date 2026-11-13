import { render } from "@testing-library/react";
import { DataFlow } from "./DataFlow";
import styles from "../../styles.css?raw";

describe("DataFlow", () => {
  it("spaces fifteen routes 18 units apart for a less cramped data highway", () => {
    const { container } = render(<DataFlow />);
    const svg = container.querySelector(".hero-data-flow svg");
    const tracks = Array.from(container.querySelectorAll(".data-flow-track"));

    expect(svg).toHaveAttribute("viewBox", "0 0 520 284");
    expect(tracks).toHaveLength(15);
    expect(tracks.map((track) => Number(track.getAttribute("d")?.match(/^M 4 (\d+)/)?.[1]))).toEqual(
      Array.from({ length: 15 }, (_, index) => 16 + index * 18),
    );
  });

  it("animates visible packets unless reduced motion is requested", () => {
    expect(styles).toMatch(/\.data-flow-pulse\s*\{[^}]*stroke-dasharray:\s*6 94;[^}]*animation:\s*hero-data-stream\s+5\.4s\s+linear\s+infinite;/);
    expect(styles).toMatch(/@keyframes hero-data-stream\s*\{/);
    expect(styles).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*\.data-flow-pulse\s*\{\s*animation:\s*none;/);
  });

  it("gives pulses independent timings and distinct static fallback positions", () => {
    const { container } = render(<DataFlow reduced />);
    const flow = container.querySelector(".hero-data-flow");
    const pulses = Array.from(container.querySelectorAll<SVGPathElement>(".data-flow-pulse"));

    expect(flow).toHaveAttribute("data-reduced", "true");
    expect(pulses).toHaveLength(15);
    expect(new Set(pulses.map((pulse) => pulse.style.animationDelay)).size).toBe(15);
    expect(new Set(pulses.map((pulse) => pulse.style.strokeDashoffset)).size).toBe(15);
  });
});
