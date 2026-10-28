import { useI18n } from "../lib/i18n";
import { brandHref } from "../lib/unifiedRouter";
import { href } from "../lib/router";
import { messages } from "../content/messages";
import { creatorName, portfolio } from "../content/portfolio";
export function GlobalFooter() {
  const { locale } = useI18n();
  const m = messages[locale];
  return (
    <footer className="av-footer">
      <div>
        <a
          className="av-footer-brand"
          href={brandHref("/")}
          lang="en"
          dir="ltr"
        >
          ARCHVANTA
        </a>
        <p>
          {locale === "fa"
            ? "معماری، زیرساخت و سیستم‌های دیجیتال"
            : "Architecture, Infrastructure & Digital Systems."}
        </p>
        <p>
          {locale === "fa" ? "طراحی و توسعه: " : "Design & development: "}
          <a href={brandHref("/portfolio")}>{creatorName[locale]}</a>
        </p>
      </div>
      <nav aria-label={locale === "fa" ? "پانوشت" : "Footer"}>
        {(["expertise", "projects", "lab", "about", "contact"] as const).map(
          (id) => (
            <a key={id} href={brandHref("/" + id)}>
              {m[id]}
            </a>
          ),
        )}
        <a href={href("/")}>FRONTIER</a>
        <a href={href("/saved")}>{locale === "fa" ? "ذخیره‌ها" : "Saved"}</a>
        <a href={href("/privacy")}>
          {locale === "fa" ? "حریم خصوصی" : "Privacy"}
        </a>
      </nav>
      <div>
        <a href={`mailto:${portfolio.profile.email}`}>
          {portfolio.profile.email}
        </a>
        <a
          href="https://github.com/archvanta"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
        <a
          href={portfolio.profile.socials[0]?.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn ↗
        </a>
        <small>© {new Date().getFullYear()} ARCHVANTA</small>
      </div>
    </footer>
  );
}
