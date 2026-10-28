import { BrandMark } from "../components/Brand";
import { Icon } from "../components/Icon";
import { site } from "../lib/content";
import { usePreferences } from "../lib/preferences";
export function Contact() {
  const { t } = usePreferences();
  return (
    <>
      <section
        id="contact"
        className="section contact"
        aria-labelledby="contact-title"
      >
        <div className="section-wrap">
          <p className="eyebrow" data-reveal>
            {t.contactLabel}
          </p>
          <div className="contact-grid" data-reveal>
            <h2 id="contact-title">
              {t.contact1}
              <br />
              <span>{t.contact2}</span>
            </h2>
            <div className="contact-action">
              <p>{t.contactBody}</p>
              <a
                className="contact-link"
                href={site.email ? `mailto:${site.email}` : site.github}
                target={site.email ? undefined : "_blank"}
                rel={site.email ? undefined : "noopener noreferrer"}
              >
                {site.email ? t.emailAction : t.contactAction}
                <span>
                  <Icon name="arrow" size={28} />
                </span>
              </a>
            </div>
          </div>
          <div className="contact-bottom">
            <a href={site.github} target="_blank" rel="noopener noreferrer">
              GitHub
              <Icon name="external" size={14} />
            </a>
            <a href={site.frontier} target="_blank" rel="noopener noreferrer">
              FRONTIER
              <Icon name="external" size={14} />
            </a>
            <a href="#home" className="back-top">
              {t.backTop}
              <Icon name="down" size={14} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export function Footer() {
  const { t } = usePreferences();
  return (
    <footer className="site-footer">
      <div className="section-wrap">
        <div
          className="footer-wordmark"
          aria-label="ARCHVANTA"
          lang="en"
          dir="ltr"
        >
          <BrandMark />
          <span>ARCHVANTA</span>
        </div>
        <div className="footer-meta">
          <p>{t.footer}</p>
          <p>© {new Date().getFullYear()} ARCHVANTA</p>
          <p>{t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
