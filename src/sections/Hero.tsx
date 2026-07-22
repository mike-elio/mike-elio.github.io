import { AnimatedBackground } from "../components/motion/AnimatedBackground";
import { PortraitOrbit } from "../components/motion/PortraitOrbit";
import { useMotionBudget } from "../components/motion/useMotionBudget";
import { useTypewriter } from "../components/motion/useTypewriter";
import { ButtonLink } from "../components/ui/ButtonLink";
import { profile } from "../data/portfolio";

export function Hero({
  forceReducedMotion = false,
}: {
  forceReducedMotion?: boolean;
}) {
  const systemReduced = useMotionBudget();
  const reduced = forceReducedMotion || systemReduced;
  const role = useTypewriter(profile.roles, { reduced });

  return (
    <section aria-labelledby="hero-title" className="hero" id="top">
      <AnimatedBackground reduced={reduced} />
      <div className="hero-copy">
        <p className="hero-eyebrow">{profile.eyebrow}</p>
        <h1 id="hero-title">{profile.name}</h1>
        <p className="hero-role">
          <span aria-hidden="true">{role}</span>
          <span aria-hidden="true" className="typewriter-caret" />
          <span className="sr-only">{profile.roles.join(", ")}</span>
        </p>
        <p className="hero-positioning">{profile.positioning}</p>
        <p className="hero-summary">{profile.summary}</p>
        <p className="availability">
          <span aria-hidden="true" />
          {profile.availability}
        </p>
        <div className="hero-actions">
          <ButtonLink href="#projects">View My Work</ButtonLink>
          <ButtonLink href="#contact" variant="secondary">
            Let's Talk
          </ButtonLink>
        </div>
        <div aria-label="Professional profiles" className="hero-socials">
          {profile.social.map((item) => (
            <a
              href={item.url}
              key={item.label}
              rel="noopener noreferrer"
              target="_blank"
            >
              {item.label}
              <span aria-hidden="true"> ↗</span>
            </a>
          ))}
        </div>
      </div>
      <div className="hero-visual">
        <PortraitOrbit />
      </div>
    </section>
  );
}
