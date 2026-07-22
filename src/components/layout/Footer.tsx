import { profile } from "../../data/portfolio";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <p><strong>{profile.name}</strong> · {profile.title}</p>
        <p>© {new Date().getFullYear()} · Designed and built with care.</p>
      </div>
      <nav aria-label="Footer links">
        {profile.social.map((item) => (
          <a href={item.url} key={item.label} rel="noopener noreferrer" target="_blank">
            {item.label}<span aria-hidden="true"> ↗</span>
          </a>
        ))}
        <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
      </nav>
    </footer>
  );
}
