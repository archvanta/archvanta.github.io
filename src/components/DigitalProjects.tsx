import { useI18n } from '../lib/i18n';
import { Icon } from './Icon';

export function DigitalProjects() {
  const { locale } = useI18n();
  return <section className="section section-wrap digital-projects" aria-labelledby="digital-projects-title">
    <p className="eyebrow">ARCHVANTA / DIGITAL PROJECTS</p>
    <h2 id="digital-projects-title">{locale === 'fa' ? 'ساخته‌های دیجیتال' : 'Digital projects'}</h2>
    <a className="cheghad-link" href="https://archvanta.github.io/cheghad/" target="_blank" rel="noopener noreferrer">
      <span><strong>{locale === 'fa' ? 'چقدر؟' : 'CHEGHAD'}</strong><small>{locale === 'fa' ? 'مدیریت مالی شخصی؛ درآمد، هزینه و دارایی‌ها.' : 'Personal finance: income, expenses and assets.'}</small></span>
      <span className="cheghad-open">{locale === 'fa' ? 'باز کردن وب‌سایت' : 'Open website'}<Icon name="external" size={17} /></span>
    </a>
    <a className="cheghad-source" href="https://github.com/archvanta/cheghad" target="_blank" rel="noopener noreferrer">{locale === 'fa' ? 'کد پروژه در GitHub' : 'Project source on GitHub'} <Icon name="external" size={13} /></a>
  </section>;
}
