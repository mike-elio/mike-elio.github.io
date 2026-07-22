export function SectionHeading({
  id,
  kicker,
  title,
  intro,
}: {
  id: string;
  kicker: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="section-heading">
      <p className="section-kicker">{kicker}</p>
      <h2 id={id}>{title}</h2>
      {intro ? <p className="section-intro">{intro}</p> : null}
    </header>
  );
}
