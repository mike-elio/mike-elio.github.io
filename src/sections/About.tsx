import { Reveal } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";

const principles = [
  ["Practical AI", "Start with a real problem and a useful user outcome."],
  [
    "Explainable Systems",
    "Make recommendations and system behavior understandable.",
  ],
  [
    "Backend Delivery",
    "Connect AI logic to typed, testable application interfaces.",
  ],
] as const;

const facts = [
  "Class of 2026",
  "2 academic AI platforms",
  "4 core AI focus areas",
];

export function About() {
  return (
    <section aria-labelledby="about-title" className="section" id="about">
      <Reveal>
        <SectionHeading
          id="about-title"
          kicker="01 / About"
          title="Engineering useful AI, end to end."
        />
      </Reveal>
      <div className="about-layout">
        <Reveal className="about-copy" delay={1}>
          <p className="lead">
            I turn AI experiments into understandable, testable applications and
            APIs.
          </p>
          <p>
            My work spans model and decision logic, explainable product behavior,
            computer-vision workflows, and backend integration. I care about
            systems that remain useful beyond a demo and can be improved safely
            over time.
          </p>
          <ul aria-label="Verified profile facts" className="fact-row">
            {facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </Reveal>
        <div className="principle-grid">
          {principles.map(([title, description], index) => (
            <Reveal delay={(index % 3) as 0 | 1 | 2} key={title}>
              <article className="principle-card">
                <p aria-hidden="true">0{index + 1}</p>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
