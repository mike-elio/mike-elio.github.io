import styles from "./styles.css?raw";

function rule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return styles.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
}

describe("responsive visual contracts", () => {
  it("keeps the mobile overlay viewport-based and vertically scrollable", () => {
    expect(styles).not.toMatch(/\.site-header\s*\{\s*backdrop-filter:/);
    expect(rule(".site-header")).toMatch(/background:\s*transparent/);
    expect(rule(".site-header::before")).toMatch(/backdrop-filter:\s*blur\(18px\)/);
    expect(rule(".site-header::before")).toMatch(
      /background:\s*rgb\(8 13 20 \/ 84%\)/,
    );
    expect(rule(".site-header::before")).toMatch(/pointer-events:\s*none/);
    expect(rule(".mobile-navigation")).toMatch(/overflow-y:\s*auto/);
    expect(rule(".mobile-navigation")).toMatch(/overscroll-behavior:\s*contain/);
  });

  it("gives the non-native dialog fallback a fixed overlay and scrolling panel", () => {
    const overlay = rule('.project-dialog--fallback[open]');
    expect(overlay).toMatch(/position:\s*fixed/);
    expect(overlay).toMatch(/inset:\s*0/);
    expect(overlay).toMatch(/z-index:\s*120/);

    const panel = rule(".project-dialog--fallback .project-dialog-panel");
    expect(panel).toMatch(/overflow-y:\s*auto/);
    expect(panel).toMatch(/overscroll-behavior:\s*contain/);
  });

  it("keeps desktop navigation targets wide and current state visible in forced colors", () => {
    expect(rule(".desktop-navigation a")).toMatch(/min-width:\s*44px/);
    expect(rule(":focus-visible")).toMatch(
      /outline:\s*3px solid var\(--accent-light\)/,
    );
    expect(styles).toMatch(
      /@media \(forced-colors: active\)[\s\S]*\.desktop-navigation a\[aria-current="location"\][^{]*\{[^}]*border-block-end:\s*3px solid Highlight/,
    );
    expect(styles).not.toMatch(
      /@media \(forced-colors: active\)[\s\S]*\.desktop-navigation a\[aria-current="location"\][^{]*\{[^}]*outline:/,
    );
  });

  it("provides pressed feedback for project and navigation controls", () => {
    expect(styles).toMatch(
      /\.project-open:active,[\s\S]*\.menu-trigger:active,[\s\S]*\.mobile-navigation > button:active,[\s\S]*\.project-dialog-panel > button:active\s*\{[^}]*transform:\s*translateY\(1px\)/,
    );
  });
});
