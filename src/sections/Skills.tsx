import { Icon } from "../components/ui/Icon";
import { Reveal } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { skills } from "../data/portfolio";

export function Skills() {
  return (
    <section aria-labelledby="skills-title" className="section" id="skills">
      <Reveal>
        <SectionHeading
          id="skills-title"
          kicker="02 / Skills"
          title="A focused stack for applied AI."
          intro="Tools I use to move from model logic to a reliable application surface."
        />
      </Reveal>
      <div className="skills-grid">
        {skills.map((group, index) => (
          <Reveal delay={(index % 4) as 0 | 1 | 2 | 3} key={group.title}>
            <article className="skill-card">
              <div className="skill-card-heading">
                <Icon name={group.icon} />
                <h3>{group.title}</h3>
              </div>
              <ul aria-label={`${group.title} skills`}>
                {group.items.map((item) => (
                  <li key={item.label}>
                    <span>{item.label}</span>
                    {item.qualifier ? <small>{item.qualifier}</small> : null}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
