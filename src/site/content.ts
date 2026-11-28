import { portfolio, tr, type PortfolioImage, type PortfolioProject } from '../content/portfolio';
import type { Locale } from '../lib/types';

export type L = Record<Locale, string>;
export const pick = (v: L, locale: Locale) => v[locale];

export const person = {
  name: { en: 'MohammadAmin Sadeghi', fa: 'محمدامین صادقی' },
  short: { en: 'M. A. Sadeghi', fa: 'م. ا. صادقی' },
  role: { en: 'Architectural designer', fa: 'طراح معماری' },
  city: { en: 'Tehran, Iran', fa: 'تهران، ایران' },
  email: portfolio.profile.email,
  linkedin: portfolio.profile.socials.find((s) => s.label === 'LinkedIn')?.url ?? 'https://linkedin.com/in/aminetun',
  github: 'https://github.com/archvanta',
  resume: '/documents/MohammadAmin_Sadeghi_Resume.pdf',
  portrait: '/work-media/images/v00.webp',
};

export const copy = {
  nav: {
    work: { en: 'Work', fa: 'پروژه‌ها' },
    drawings: { en: 'Drawings', fa: 'نقشه‌ها' },
    about: { en: 'About', fa: 'درباره من' },
    ventures: { en: 'Ventures', fa: 'پروژه‌های دیجیتال' },
    frontier: { en: 'FRONTIER', fa: 'FRONTIER' },
    contact: { en: 'Contact', fa: 'تماس' },
    menu: { en: 'Menu', fa: 'منو' },
    close: { en: 'Close menu', fa: 'بستن منو' },
    search: { en: 'Search', fa: 'جستجو' },
    toLight: { en: 'Switch to light theme', fa: 'تم روشن' },
    toDark: { en: 'Switch to dark theme', fa: 'تم تیره' },
    lang: { en: 'فا', fa: 'EN' },
    langLabel: { en: 'Switch language to Persian', fa: 'Switch language to English' },
    home: { en: 'ARCHVANTA home', fa: 'صفحه اصلی ARCHVANTA' },
  },
  hero: {
    l1: { en: 'Architecture,', fa: 'معماری،' },
    l2a: { en: 'drawn with ', fa: 'با ' },
    l2b: { en: 'intent.', fa: 'دقت ترسیم‌شده.' },
    body: {
      en: 'I am MohammadAmin Sadeghi, an architectural designer in Tehran. I design buildings and technical spaces, model them in BIM, and turn dense information into drawings people can read.',
      fa: 'من محمدامین صادقی هستم، طراح معماری در تهران. ساختمان و فضاهای فنی طراحی می‌کنم، آن‌ها را در BIM مدل می‌کنم و اطلاعات پیچیده را به نقشه‌هایی تبدیل می‌کنم که همه بتوانند بخوانند.',
    },
    ctaWork: { en: 'See the work', fa: 'دیدن پروژه‌ها' },
    ctaDrawings: { en: 'Open the drawings', fa: 'باز کردن نقشه‌ها' },
    caption: { en: 'The Last Shadow of Time — aerial view', fa: 'آخرین سایهٔ زمان — نمای هوایی' },
    ctaAbout: { en: 'About me', fa: 'درباره من' },
    ctaExplore: { en: 'What is on this site', fa: 'این سایت چه دارد' },
  },
  home: {
    aboutLabel: { en: '01 — Who I am', fa: '۰۱ — من کی هستم' },
    aboutTitle: { en: 'Hello, I am Amin', fa: 'سلام، من امین هستم' },
    aboutBody: {
      en: 'I trained as an architect and work across architectural design, technical documentation, BIM and 3D visualisation. ARCHVANTA is where I keep it together: my projects, the drawings behind them, and the software I build on the side, like FRONTIER.',
      fa: 'معماری خوانده‌ام و در طراحی معماری، مستندسازی فنی، BIM و مصورسازی سه‌بعدی کار می‌کنم. ARCHVANTA جایی است که همهٔ این‌ها را کنار هم نگه می‌دارم: پروژه‌هایم، نقشه‌های پشتشان و نرم‌افزارهایی که در کنارش می‌سازم، مثل FRONTIER.',
    },
    mapLabel: { en: '02 — On this site', fa: '۰۲ — در این سایت' },
    mapTitle: { en: 'What you will find here', fa: 'اینجا چه پیدا می‌کنید' },
    mapIntro: {
      en: 'ARCHVANTA is my studio online: the place for my architecture, my drawings and the digital products I build. Pick a room.',
      fa: 'ARCHVANTA استودیوی آنلاین من است: جایی برای معماری، نقشه‌ها و محصولات دیجیتالی که می‌سازم. یکی از بخش‌ها را انتخاب کنید.',
    },
    practiceLabel: { en: '03 — Skills', fa: '۰۳ — مهارت‌ها' },
    sections: [
      { key: 'work', href: '/work', title: { en: 'Work', fa: 'پروژه‌ها' }, body: { en: 'Data center design, architecture, sports and urban projects, each with its story, drawings and images.', fa: 'طراحی دیتاسنتر و پروژه‌های معماری، ورزشی و شهری، هرکدام با روایت، نقشه‌ها و تصاویرش.' } },
      { key: 'drawings', href: '/drawings', title: { en: 'Drawings', fa: 'نقشه‌ها' }, body: { en: 'Plans, sections and elevations you can zoom into, sheet by sheet.', fa: 'پلان، برش و نما که می‌شود شیت‌به‌شیت رویشان زوم کرد.' } },
      { key: 'about', href: '/about', title: { en: 'About & skills', fa: 'درباره من و مهارت‌ها' }, body: { en: 'Background, experience, software and my résumé.', fa: 'سابقه، تجربه، نرم‌افزارها و رزومه.' } },
      { key: 'ventures', href: '/ventures', title: { en: 'Ventures', fa: 'پروژه‌های دیجیتال' }, body: { en: 'Digital products I design and build, plus interactive 3D objects.', fa: 'محصولات دیجیتالی که طراحی می‌کنم و می‌سازم، به‌همراه اشیای سه‌بعدی تعاملی.' } },
      { key: 'frontier', href: '#/frontier/', title: { en: 'FRONTIER', fa: 'FRONTIER' }, body: { en: 'My bilingual technology-news site, updated several times a day.', fa: 'سایت خبر فناوری دوزبانهٔ من که چند بار در روز به‌روز می‌شود.' } },
      { key: 'contact', href: '/contact', title: { en: 'Contact', fa: 'تماس' }, body: { en: 'Email, LinkedIn and GitHub.', fa: 'ایمیل، لینکدین و گیت‌هاب.' } },
    ],
  },
  ticker: <Record<Locale, string[]>>{
    en: ['Architectural design', 'Plans & sections', 'BIM · Revit', 'Visualisation', 'Technical space planning', 'Urban analysis · GIS', 'Digital products'],
    fa: ['طراحی معماری', 'پلان و برش', 'BIM · رویت', 'مصورسازی', 'برنامه‌ریزی فضاهای فنی', 'تحلیل شهری · GIS', 'محصولات دیجیتال'],
  },
  work: {
    label: { en: '01 — Selected work', fa: '۰۱ — پروژه‌های منتخب' },
    title: { en: 'Selected work', fa: 'پروژه‌های منتخب' },
    all: { en: 'All projects', fa: 'همهٔ پروژه‌ها' },
    pending: { en: 'Drawings in preparation', fa: 'نقشه‌ها در حال آماده‌سازی' },
    dcLabel: { en: 'Featured — data center design', fa: 'ویژه — طراحی دیتاسنتر' },
    dcTitle: { en: 'Data center design', fa: 'طراحی دیتاسنتر' },
    dcNote: {
      en: 'Client work. Client, site and team details are withheld, and exact building dimensions are left out. Drawings are added only after they have been cleared.',
      fa: 'کار کارفرمایی. نام کارفرما، محل پروژه و اعضای تیم ذکر نمی‌شود و ابعاد دقیق ساختمان حذف شده است. نقشه‌ها فقط پس از پاک‌سازی اضافه می‌شوند.',
    },
    dcPending: { en: 'Drawings being cleared', fa: 'نقشه‌ها در حال پاک‌سازی' },
    otherTitle: { en: 'Architecture & urban studies', fa: 'معماری و مطالعات شهری' },
    otherLabel: { en: 'Design & academic projects', fa: 'پروژه‌های طراحی و دانشگاهی' },
    intro: {
      en: 'Academic and independent projects, carried from concept through plans, sections and visualisation.',
      fa: 'پروژه‌های دانشگاهی و مستقل، از ایده تا پلان، برش و مصورسازی.',
    },
  },
  drawings: {
    label: { en: '02 — Drawing room', fa: '۰۲ — اتاق نقشه' },
    title: { en: 'Read the drawings', fa: 'نقشه‌ها را بخوانید' },
    intro: {
      en: 'Plans, sections and elevations at full resolution. Drag to pan, scroll or pinch to zoom, and switch to blueprint ink for night reading.',
      fa: 'پلان، برش و نما با وضوح کامل. برای جابه‌جایی بکشید، برای زوم اسکرول یا دو انگشت را باز کنید، و برای خواندن در تاریکی حالت بلوپرینت را بزنید.',
    },
    open: { en: 'Open the full drawing room', fa: 'باز کردن کامل اتاق نقشه' },
    sheets: { en: 'Sheets', fa: 'شیت‌ها' },
    zoomIn: { en: 'Zoom in', fa: 'بزرگ‌نمایی' },
    zoomOut: { en: 'Zoom out', fa: 'کوچک‌نمایی' },
    fit: { en: 'Fit to view', fa: 'نمایش کامل' },
    full: { en: 'Full screen', fa: 'تمام‌صفحه' },
    ink: { en: 'Blueprint ink', fa: 'حالت بلوپرینت' },
    layers: { en: 'Layers', fa: 'لایه‌ها' },
    hint: { en: 'Drag · scroll · pinch · +/− · 0', fa: 'کشیدن · اسکرول · دو انگشت · +/− · 0' },
    viewer: { en: 'Drawing viewer', fa: 'نمایشگر نقشه' },
    note: {
      en: 'Drawings are published as images or layered SVG converted from DXF. Confidential client drawings are never published.',
      fa: 'نقشه‌ها به‌صورت تصویر یا SVG لایه‌دار (تبدیل‌شده از DXF) منتشر می‌شوند. نقشه‌های محرمانهٔ کارفرما هرگز منتشر نمی‌شوند.',
    },
  },
  practice: {
    label: { en: '03 — Practice', fa: '۰۳ — حوزه‌های کار' },
    title: { en: 'What I do', fa: 'کاری که انجام می‌دهم' },
  },
  ventures: {
    label: { en: '04 — Ventures', fa: '۰۴ — پروژه‌های دیجیتال' },
    title: { en: 'Things I build', fa: 'چیزهایی که می‌سازم' },
    intro: {
      en: 'Alongside architecture I design and ship digital products. FRONTIER is the largest of them.',
      fa: 'در کنار معماری، محصولات دیجیتال طراحی و منتشر می‌کنم. FRONTIER بزرگ‌ترین آن‌هاست.',
    },
    open: { en: 'All ventures', fa: 'همهٔ پروژه‌های دیجیتال' },
    read: { en: 'Read the case study', fa: 'خواندن معرفی پروژه' },
    live: { en: 'Live', fa: 'فعال' },
  },
  about: {
    label: { en: '05 — About', fa: '۰۵ — درباره من' },
    title: { en: 'About', fa: 'درباره من' },
    more: { en: 'More about me', fa: 'بیشتر درباره من' },
    lede: {
      en: 'An architect who works where the drawing has to be correct before it can be elegant.',
      fa: 'معماری که جایی کار می‌کند که نقشه باید اول درست باشد تا بعد زیبا.',
    },
  },
  cta: {
    title1: { en: 'Let’s draw', fa: 'بیایید با هم' },
    title2: { en: 'something.', fa: 'طراحی کنیم.' },
    body: { en: 'Open to architectural, BIM and visualisation work.', fa: 'آماده همکاری در طراحی معماری، BIM و مصورسازی.' },
    resume: { en: 'Download résumé (PDF)', fa: 'دانلود رزومه (PDF)' },
  },
  footer: {
    blurb: {
      en: 'ARCHVANTA is the studio of MohammadAmin Sadeghi: architecture, drawings and the digital tools around them.',
      fa: 'ARCHVANTA استودیوی محمدامین صادقی است: معماری، نقشه و ابزارهای دیجیتال پیرامون آن.',
    },
    site: { en: 'Site', fa: 'سایت' },
    elsewhere: { en: 'Elsewhere', fa: 'جای دیگر' },
    studio: { en: 'Studio', fa: 'استودیو' },
    rights: { en: 'All drawings and images © MohammadAmin Sadeghi.', fa: 'همهٔ نقشه‌ها و تصاویر © محمدامین صادقی.' },
  },
  page: {
    workTitle: { en: 'Work', fa: 'پروژه‌ها' },
    workBody: {
      en: 'Data center design, architecture, sports and urban studies. Every image here is from the project itself; nothing is a stock render.',
      fa: 'طراحی دیتاسنتر، معماری، ورزشی و مطالعات شهری. همهٔ تصاویر از خود پروژه‌اند، هیچ‌کدام تصویر آماده نیست.',
    },
    drawingsTitle: { en: 'Drawing room', fa: 'اتاق نقشه' },
    aboutTitle: { en: 'About', fa: 'درباره من' },
    venturesTitle: { en: 'Ventures', fa: 'پروژه‌های دیجیتال' },
    contactTitle: { en: 'Contact', fa: 'تماس' },
    contactBody: {
      en: 'For architectural design, BIM modelling, drawing production or visualisation, write to me directly.',
      fa: 'برای طراحی معماری، مدل‌سازی BIM، تولید نقشه یا مصورسازی، مستقیم برایم بنویسید.',
    },
    filterAll: { en: 'All', fa: 'همه' },
    back: { en: 'Back to work', fa: 'بازگشت به پروژه‌ها' },
    next: { en: 'Next project', fa: 'پروژهٔ بعدی' },
    overview: { en: 'Overview', fa: 'معرفی' },
    challenge: { en: 'The problem', fa: 'مسئله' },
    approach: { en: 'Approach', fa: 'رویکرد' },
    solution: { en: 'Solution', fa: 'راه‌حل' },
    learned: { en: 'What I learned', fa: 'آنچه آموختم' },
    gallery: { en: 'Images', fa: 'تصاویر' },
    drawings: { en: 'Drawings', fa: 'نقشه‌ها' },
    boards: { en: 'Presentation boards', fa: 'شیت‌های ارائه' },
    role: { en: 'Role', fa: 'نقش' },
    year: { en: 'Year', fa: 'سال' },
    type: { en: 'Type', fa: 'نوع' },
    tools: { en: 'Tools', fa: 'ابزارها' },
    status: { en: 'Status', fa: 'وضعیت' },
    notFound: { en: 'This project does not exist.', fa: 'این پروژه وجود ندارد.' },
    model: { en: 'Open the 3D site model', fa: 'باز کردن مدل سه‌بعدی سایت' },
    proposal: { en: 'Study slides', fa: 'اسلایدهای مطالعه' },
    closeImage: { en: 'Close image', fa: 'بستن تصویر' },
    prevImage: { en: 'Previous image', fa: 'تصویر قبلی' },
    nextImage: { en: 'Next image', fa: 'تصویر بعدی' },
  },
};

/** The Design 5 studio project: real and in progress, but no exported drawings are available yet. */
export const pendingProject = {
  slug: 'design-studio-5',
  title: { en: 'Design Studio 5', fa: 'طرح معماری ۵' },
  type: { en: 'Architectural design · Revit model', fa: 'طراحی معماری · مدل رویت' },
  year: '2026',
};

export interface Sheet {
  id: string;
  project: string;
  title: L;
  kind: L;
  src: string;
  svg?: boolean;
}

const KIND = {
  plan: { en: 'Plan', fa: 'پلان' },
  section: { en: 'Section', fa: 'برش' },
  elevation: { en: 'Elevation', fa: 'نما' },
  diagram: { en: 'Diagram', fa: 'دیاگرام' },
  map: { en: 'Map', fa: 'نقشه' },
  board: { en: 'Board', fa: 'شیت ارائه' },
} satisfies Record<string, L>;
const SHEET_FA: Record<string, string> = {
  'Exploded assembly': 'اکسونومتریک انفجاری',
  'Massing rotation': 'چرخش توده',
  'East elevation': 'نمای شرقی',
  'North elevation': 'نمای شمالی',
  Section: 'برش',
  'Plan — level 01': 'پلان — طبقهٔ ۱',
  'Plan — level 02': 'پلان — طبقهٔ ۲',
  'Top view': 'نمای از بالا',
  'Site plan': 'پلان سایت',
  'Section A–A': 'برش A–A',
  'Section B–B': 'برش B–B',
  'Board 01': 'شیت ارائهٔ ۱',
  'Board 02': 'شیت ارائهٔ ۲',
  'Sheet 01': 'شیت ۱ — پلان سایت',
  'Sheet 02': 'شیت ۲ — برش‌های معماری',
  'Sheet 03': 'شیت ۳ — مطالعهٔ ایزومتریک',
  'Hypsometry and hillshade of Ramsar county': 'هیپسومتری و سایه‌روشن شهرستان رامسر',
};
const faLabel = (en: string) => SHEET_FA[en] ?? tr(en, 'fa');
function kindOf(label: string): keyof typeof KIND | null {
  if (/plan/i.test(label)) return 'plan';
  if (/section/i.test(label)) return 'section';
  if (/elevation/i.test(label)) return 'elevation';
  if (/exploded|massing|top view/i.test(label)) return 'diagram';
  return null;
}

export function projects(): PortfolioProject[] {
  return portfolio.projects;
}

/** Every drawing-type image in the published portfolio, in a stable order, plus presentation boards. */
export function sheets(): Sheet[] {
  const out: Sheet[] = [];
  for (const p of portfolio.projects) {
    const imgs: PortfolioImage[] = p.gallery ?? [];
    for (const img of imgs) {
      const svg = /\.svg$/i.test(img.src);
      const k = kindOf(img.label) ?? (svg ? 'plan' : null);
      if (!k) continue;
      out.push({ id: img.src.split('/').pop()!.replace(/\.\w+$/, ''), project: p.slug, title: { en: img.label, fa: faLabel(img.label) }, kind: KIND[k], src: img.src, ...(svg ? { svg: true } : {}) });
    }
    if (p.slug === 'ramsar-urban-baseline-study' && p.cover) {
      out.push({ id: 'cv-ramsar2', project: p.slug, title: { en: p.cover.label, fa: faLabel(p.cover.label) }, kind: KIND.map, src: p.cover.src });
    }
    for (const b of p.boards?.items ?? []) {
      out.push({ id: b.src.split('/').pop()!.replace(/\.\w+$/, ''), project: p.slug, title: { en: `${b.label} — ${b.caption ?? ''}`.replace(/ — $/, ''), fa: faLabel(b.label) }, kind: KIND.board, src: b.src });
    }
  }
  return out;
}

export const practice = [
  {
    kind: 'architecture' as const,
    title: { en: 'Architecture & planning', fa: 'معماری و برنامه‌ریزی' },
    body: {
      en: 'Concept to drawing set: site reading, massing, plans, sections, façade systems and presentation boards.',
      fa: 'از ایده تا مجموعه نقشه: خوانش سایت، توده‌گذاری، پلان، برش، سیستم نما و شیت‌های ارائه.',
    },
    tags: ['Revit', 'AutoCAD', 'SketchUp'],
  },
  {
    kind: 'technical' as const,
    title: { en: 'Technical spaces', fa: 'فضاهای فنی' },
    body: {
      en: 'Planning equipment-heavy rooms inside existing buildings: zoning, layouts, clearances and service routes resolved against a fixed structure.',
      fa: 'برنامه‌ریزی فضاهای پرتجهیز داخل ساختمان‌های موجود: پهنه‌بندی، چیدمان، فاصله‌های سرویس و مسیرهای تأسیسات در برابر سازهٔ ثابت.',
    },
    confidential: {
      en: 'Client work in this field is shown without client, site or team details.',
      fa: 'کارهای کارفرمایی این حوزه بدون نام کارفرما، محل پروژه و اعضای تیم نمایش داده می‌شود.',
    },
    tags: ['Retrofit', 'Zoning', 'Clearances'],
  },
  {
    kind: 'bim' as const,
    title: { en: 'BIM & visualisation', fa: 'BIM و مصورسازی' },
    body: {
      en: 'Models built at true size, then read as cutaways, exploded axonometrics, renders and assembly sequences.',
      fa: 'مدل‌هایی با ابعاد واقعی که به‌صورت برش سه‌بعدی، اکسونومتریک انفجاری، رندر و توالی مونتاژ خوانده می‌شوند.',
    },
    tags: ['Enscape', 'D5', '3ds Max', 'IFC / DXF'],
  },
  {
    kind: 'digital' as const,
    title: { en: 'Digital products', fa: 'محصولات دیجیتال' },
    body: {
      en: 'Websites, data tools and object libraries for architects, built with AI agents as a disciplined team.',
      fa: 'وب‌سایت، ابزار داده و کتابخانهٔ آبجکت برای معماران، ساخته‌شده با عامل‌های هوش مصنوعی به‌عنوان یک تیم منظم.',
    },
    tags: ['React', 'Three.js', 'GIS'],
  },
];

/** Abstract description of the technical-space capability. No project, client, dimension or drawing. */
export const capabilitySteps = [
  { t: { en: 'Read the existing building', fa: 'خوانش ساختمان موجود' }, d: { en: 'Grid, slab, risers and everything that cannot move.', fa: 'شبکهٔ ستون، دال، رایزرها و هر چیزی که جابه‌جا نمی‌شود.' } },
  { t: { en: 'Zone before layout', fa: 'پهنه‌بندی پیش از چیدمان' }, d: { en: 'Equipment, plant, support and circulation drawn as zones first.', fa: 'تجهیزات، تأسیسات، پشتیبانی و گردش ابتدا به‌صورت پهنه ترسیم می‌شوند.' } },
  { t: { en: 'Prove the clearances', fa: 'اثبات فاصله‌های سرویس' }, d: { en: 'Front, rear and delivery routes checked in the model, not assumed.', fa: 'مسیرهای جلو، پشت و حمل در مدل بررسی می‌شوند، نه فرض.' } },
  { t: { en: 'Coordinate the services', fa: 'هماهنگی تأسیسات' }, d: { en: 'Cooling, power and cabling share space without clashes.', fa: 'سرمایش، برق و کابل‌کشی بدون تداخل فضا را تقسیم می‌کنند.' } },
  { t: { en: 'Document what is known', fa: 'مستندسازی دانسته‌ها' }, d: { en: 'Every figure marked as observed, documented or still open.', fa: 'هر عدد با برچسب مشاهده‌شده، مستند یا باز مشخص می‌شود.' } },
];

export interface Venture {
  slug: string;
  name: string;
  kind: L;
  body: L;
  url: string;
  internal?: boolean;
  image?: string;
}
export const ventures: Venture[] = [
  {
    slug: 'frontier',
    name: 'FRONTIER',
    kind: { en: 'Bilingual technology news', fa: 'خبر فناوری دوزبانه' },
    body: {
      en: 'A Persian and English news desk for AI, games and data infrastructure. Collected from public sources several times a day, deduplicated and ranked by an open formula, with no paid APIs.',
      fa: 'میز خبری فارسی و انگلیسی دربارهٔ هوش مصنوعی، بازی و زیرساخت داده. چند بار در روز از منابع عمومی جمع‌آوری، تکراری‌ها حذف و با فرمولی باز رتبه‌بندی می‌شود، بدون هیچ API پولی.',
    },
    url: '#/frontier/',
    internal: true,
    image: '/images/frontier-live.webp',
  },
  ...portfolio.home.platforms.items.map((p) => ({
    slug: p.name.toLowerCase().replace(/\s+/g, '-'),
    name: p.name,
    kind: { en: p.kind, fa: tr(p.kind, 'fa') },
    body: { en: p.body, fa: tr(p.body, 'fa') },
    url: p.url,
  })),
  {
    slug: 'cheghad',
    name: 'CHEGHAD',
    kind: { en: 'Personal finance app', fa: 'اپ مالی شخصی' },
    body: {
      en: 'Income, expenses and assets in one place, in Persian and English. Runs in the browser; the source is on GitHub.',
      fa: 'درآمد، هزینه و دارایی‌ها در یک جا، به فارسی و انگلیسی. در مرورگر اجرا می‌شود و کدش در GitHub است.',
    },
    url: 'https://archvanta.github.io/cheghad/',
  },
];
