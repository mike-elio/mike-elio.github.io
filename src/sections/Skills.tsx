import { useState } from "react";
import { Icon } from "../components/ui/Icon";
import { Reveal } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { skills } from "../data/portfolio";

const primarySkills = new Set([
  "Python", "JavaScript", "SQL", "HTML5",
  "PyTorch", "Hugging Face Transformers", "Machine Learning", "Natural Language Processing (NLP)",
  "FastAPI", "Node.js", "Express.js", "REST APIs",
  "Git", "GitHub", "Microsoft Azure", "Ollama",
]);

export function Skills() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section aria-labelledby="skills-title" className="section" id="skills">
      <Reveal>
        <SectionHeading
          id="skills-title"
          kicker="02 / Skills"
          title="A focused stack for applied AI."
          intro="My core tools, with the full stack one click away."
        />
      </Reveal>
      <div className="skills-grid" id="skills-list">
        {skills.map((group, index) => (
          <Reveal delay={(index % 4) as 0 | 1 | 2 | 3} key={group.title}>
            <article className="skill-card">
              <div className="skill-card-heading">
                <Icon name={group.icon} />
                <h3>{group.title}</h3>
              </div>
              <ul aria-label={`${group.title} skills`}>
                {group.items.filter((item) => expanded || primarySkills.has(item.label)).map((item) => (
                  <li key={item.label}><span>{item.label}</span></li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
      <button
        className="skills-toggle"
        aria-expanded={expanded}
        aria-controls="skills-list"
        onClick={() => setExpanded((value) => !value)}
        type="button"
      >
        {expanded ? "Show core skills" : "View all skills"}
      </button>
    </section>
  );
}
