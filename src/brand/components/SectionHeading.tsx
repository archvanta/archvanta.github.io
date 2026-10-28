export function SectionHeading({
  label,
  title,
  accent,
  body,
}: {
  label: string;
  title: string;
  accent?: string;
  body?: string;
}) {
  return (
    <header className="section-heading" data-reveal>
      <p className="eyebrow">{label}</p>
      <div className="heading-grid">
        <h2>
          {title}
          {accent && (
            <>
              <br />
              <span className="muted">{accent}</span>
            </>
          )}
        </h2>
        {body && <p className="section-intro">{body}</p>}
      </div>
    </header>
  );
}
