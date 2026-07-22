import { Reveal } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { profile } from "../data/portfolio";
import { ContactForm } from "../features/contact/ContactForm";

export function Contact() {
  return (
    <section
      aria-labelledby="contact-title"
      className="section contact-section"
      id="contact"
    >
      <Reveal className="contact-copy">
        <SectionHeading
          id="contact-title"
          kicker="06 / Contact"
          title="Let's build something useful."
          intro="Have an AI/ML, backend AI, or collaboration opportunity? Send the details below."
        />
        <div className="contact-socials">
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
        <p className="privacy-note">
          Your name, email, subject, and message are used only to respond to your
          request.
        </p>
      </Reveal>
      <Reveal className="contact-form-wrap" delay={1}>
        <ContactForm />
      </Reveal>
    </section>
  );
}
