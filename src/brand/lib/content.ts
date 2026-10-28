export type Language = "en" | "fa";
export type Localized = Record<Language, string>;
export const site = {
  name: "ARCHVANTA",
  url: "https://archvanta.github.io/",
  github: "https://github.com/archvanta",
  frontier: "#/frontier/",
  // Configure a real address to enable the email contact action. Never ship a placeholder address.
  email: "sadeghimohammadamin83@gmail.com" as string,
};
export const copy = {
  en: {
    nav: ["Home", "Expertise", "Work", "Lab", "About", "Contact"],
    skip: "Skip to content",
    menu: "Open navigation",
    closeMenu: "Close navigation",
    light: "Switch to light theme",
    dark: "Switch to dark theme",
    perspective: "AN INDEPENDENT DESIGN PERSPECTIVE",
    disciplines: "ARCHITECTURE / BIM / INFRASTRUCTURE / DIGITAL",
    hero1: "Designing space.",
    hero2: "Engineering",
    hero3: "the future.",
    heroBody:
      "Architecture, intelligent infrastructure and digital systems — designed through a new perspective.",
    explore: "Explore our work",
    discover: "Discover Archvanta",
    scroll: "SCROLL TO DISCOVER",
    modelLabel: "ARCHVANTA / SPATIAL STUDY 001",
    modelNote: "Interactive concept model · not a construction document",
    modelModes: ["Massing", "Structure", "BIM layers", "Infrastructure"],
    modelAccessible:
      "An original axonometric study: four building levels, a structural frame, coordinated model layers and a conceptual server hall.",
    manifestoLabel: "01 / THE PERSPECTIVE",
    manifestoTitle: "Perspective defines",
    manifestoAccent: "everything.",
    manifestoBody:
      "We believe architecture extends beyond physical buildings. It connects space, infrastructure, information and technology into systems designed to work together.",
    manifestoFoot:
      "A practice of asking better questions. A process of finding more considered answers.",
    expertiseLabel: "02 / FIELDS OF EXPLORATION",
    expertiseTitle: "One perspective.",
    expertiseAccent: "Multiple dimensions.",
    expertiseIntro:
      "From the scale of a room to the logic of a system. Four connected fields inform our approach.",
    workLabel: "03 / SELECTED EXPLORATIONS",
    workTitle: "Ideas, given form.",
    workIntro:
      "An evolving collection of self-directed concept studies. These explorations are not completed client commissions.",
    allWork: "All studies",
    concept: "Concept study",
    openStudy: "Open study",
    closeStudy: "Close study",
    projectStatement: "THE STUDY",
    projectScope: "SCOPE",
    projectStatus: "Self-directed exploration",
    projectYear: "DEVELOPED FOR THIS WEBSITE",
    gallery: "Study views",
    systemsLabel: "04 / FROM SPACE TO SYSTEMS",
    systemsTitle: "The building is",
    systemsAccent: "only the beginning.",
    systemsIntro:
      "Explore how four layers come together. Select a layer to see the relationship between space and the systems that support it.",
    layerLabel: "Design layers",
    labLabel: "05 / ARCHVANTA LAB",
    labTitle: "Beyond the built.",
    labBody:
      "Exploring the intersection of architecture, engineering, information and interactive technology.",
    live: "LIVE DIGITAL PROJECT",
    frontierBody:
      "A bilingual lens on technology. FRONTIER brings AI, infrastructure and emerging technology news into a focused reading experience.",
    frontierLink: "Explore FRONTIER",
    frontierMeta: "EDITORIAL PLATFORM / EN + FA",
    authenticPreview:
      "Actual FRONTIER interface, captured from the live site. News and appearance may change.",
    futureLab: "An open space for what comes next.",
    futureLabBody:
      "Architectural tools, visualization experiments and digital experiences. New explorations will be added here as they take shape.",
    aboutLabel: "06 / THE PRACTICE",
    aboutTitle: "Built around",
    aboutAccent: "perspective.",
    aboutBody:
      "Archvanta is an independent and evolving creative practice. It brings architectural thinking, engineering curiosity and digital craft into one connected approach.",
    aboutSecond:
      "The ambition is simple: to understand how things work, question how they could work better, and give thoughtful ideas a clear, spatial form.",
    aboutFoot: "INDEPENDENT BY DESIGN. CONNECTED BY CURIOSITY.",
    contactLabel: "07 / START A CONVERSATION",
    contact1: "Let’s design",
    contact2: "what’s next.",
    contactBody:
      "Have a project, an idea, or a new perspective worth exploring?",
    contactAction: "Connect on GitHub",
    emailAction: "Send an email",
    backTop: "Back to top",
    footer: "Architecture. Infrastructure. Digital systems.",
    rights: "Independent & evolving.",
    imageAlt: "Live FRONTIER news platform preview",
    external: "opens in a new tab",
  },
  fa: {
    nav: ["خانه", "حوزه‌ها", "مطالعات", "آزمایشگاه", "درباره", "ارتباط"],
    skip: "رفتن به محتوای اصلی",
    menu: "باز کردن منو",
    closeMenu: "بستن منو",
    light: "تغییر به تم روشن",
    dark: "تغییر به تم تیره",
    perspective: "دیدگاهی مستقل در طراحی",
    disciplines: "معماری / BIM / زیرساخت / تجربه‌های دیجیتال",
    hero1: "طراحی فضا.",
    hero2: "مهندسیِ",
    hero3: "آینده.",
    heroBody:
      "معماری، زیرساخت هوشمند و سیستم‌های دیجیتال؛ با نگاهی تازه به طراحی.",
    explore: "کشف مطالعات",
    discover: "آشنایی با آرک‌ونتا",
    scroll: "برای کشف بیشتر پایین بروید",
    modelLabel: "ARCHVANTA / SPATIAL STUDY 001",
    modelNote: "مدل مفهومی تعاملی؛ نقشهٔ اجرایی نیست",
    modelModes: ["حجم‌پردازی", "سازه", "لایه‌های BIM", "زیرساخت"],
    modelAccessible:
      "مطالعهٔ آکسونومتریک اختصاصی با چهار تراز، قاب سازه‌ای، لایه‌های هماهنگ مدل و یک سالن سرور مفهومی.",
    manifestoLabel: "۰۱ / زاویهٔ نگاه",
    manifestoTitle: "زاویهٔ نگاه،",
    manifestoAccent: "همه‌چیز را می‌سازد.",
    manifestoBody:
      "معماری را فراتر از ساختمان می‌بینیم؛ پیوندی میان فضا، زیرساخت، اطلاعات و فناوری، در قالب سیستم‌هایی که برای کارکردن در کنار هم طراحی می‌شوند.",
    manifestoFoot:
      "رویکردی برای پرسیدن سؤال‌های بهتر؛ فرایندی برای رسیدن به پاسخ‌های سنجیده‌تر.",
    expertiseLabel: "۰۲ / حوزه‌های کاوش",
    expertiseTitle: "یک نگاه.",
    expertiseAccent: "ابعادی گوناگون.",
    expertiseIntro:
      "از مقیاس یک اتاق تا منطق یک سیستم؛ چهار حوزهٔ مرتبط، رویکرد ما را شکل می‌دهند.",
    workLabel: "۰۳ / مطالعات منتخب",
    workTitle: "ایده‌هایی که شکل می‌گیرند.",
    workIntro:
      "مجموعه‌ای در حال توسعه از مطالعات مفهومی مستقل؛ این تجربه‌ها پروژه‌های اجراشده برای کارفرما نیستند.",
    allWork: "همهٔ مطالعات",
    concept: "مطالعهٔ مفهومی",
    openStudy: "دیدن مطالعه",
    closeStudy: "بستن مطالعه",
    projectStatement: "دربارهٔ مطالعه",
    projectScope: "دامنهٔ مطالعه",
    projectStatus: "کاوش مستقل",
    projectYear: "طراحی‌شده برای این وب‌سایت",
    gallery: "نماهای مطالعه",
    systemsLabel: "۰۴ / از فضا تا سیستم",
    systemsTitle: "ساختمان،",
    systemsAccent: "تنها آغاز ماجراست.",
    systemsIntro:
      "پیوند چهار لایه را کشف کنید. هر لایه را انتخاب کنید تا ارتباط فضا و سیستم‌های پشتیبان آن را ببینید.",
    layerLabel: "لایه‌های طراحی",
    labLabel: "۰۵ / آزمایشگاه آرک‌ونتا",
    labTitle: "فراتر از ساختن.",
    labBody: "کاوش در نقطهٔ تلاقی معماری، مهندسی، اطلاعات و فناوری تعاملی.",
    live: "پروژهٔ دیجیتال فعال",
    frontierBody:
      "نگاهی دوزبانه به فناوری. فرانتیر خبرهای هوش مصنوعی، زیرساخت و فناوری‌های نو را در تجربه‌ای متمرکز برای خواندن گردآوری می‌کند.",
    frontierLink: "ورود به FRONTIER",
    frontierMeta: "پلتفرم خبری / فارسی + انگلیسی",
    authenticPreview:
      "تصویر واقعی از نسخهٔ زندهٔ فرانتیر؛ خبرها و ظاهر آن ممکن است تغییر کنند.",
    futureLab: "جایی برای ایدهٔ بعدی.",
    futureLabBody:
      "ابزارهای معماری، تجربه‌های تجسم و محصولات دیجیتال؛ کاوش‌های تازه با شکل‌گرفتنشان اینجا اضافه می‌شوند.",
    aboutLabel: "۰۶ / رویکرد ما",
    aboutTitle: "شکل‌گرفته از",
    aboutAccent: "نگاهی تازه.",
    aboutBody:
      "آرک‌ونتا یک هویت خلاق و مستقل در حال توسعه است؛ پیوندی میان تفکر معماری، کنجکاوی مهندسی و مهارت ساخت تجربه‌های دیجیتال.",
    aboutSecond:
      "هدف ساده است: فهمیدن سازوکارها، پرسیدن اینکه چطور می‌توان بهترشان کرد، و بخشیدن فرمی روشن و فضایی به ایده‌های سنجیده.",
    aboutFoot: "مستقل در طراحی؛ پیوسته در کنجکاوی.",
    contactLabel: "۰۷ / آغاز گفت‌وگو",
    contact1: "آینده را",
    contact2: "طراحی کنیم.",
    contactBody: "پروژه، ایده یا زاویهٔ نگاه تازه‌ای برای گفت‌وگو دارید؟",
    contactAction: "ارتباط در گیت‌هاب",
    emailAction: "ارسال ایمیل",
    backTop: "بازگشت به بالا",
    footer: "معماری. زیرساخت. سیستم‌های دیجیتال.",
    rights: "مستقل و در حال توسعه.",
    imageAlt: "پیش‌نمایش واقعی پلتفرم خبری فرانتیر",
    external: "در زبانهٔ جدید باز می‌شود",
  },
};
export const expertise = [
  {
    id: "architecture",
    number: "01",
    title: { en: "Architecture & spatial design", fa: "معماری و طراحی فضا" },
    body: {
      en: "Concepts, planning and spatial organization. A clear architectural idea, carried through every scale.",
      fa: "ایده‌پردازی، برنامه‌ریزی و سازمان‌دهی فضایی؛ یک ایدهٔ روشن معماری در همهٔ مقیاس‌ها.",
    },
    tags: ["SPACE", "FORM", "CONTEXT"],
    mode: 0,
  },
  {
    id: "bim",
    number: "02",
    title: { en: "BIM & digital construction", fa: "BIM و ساخت دیجیتال" },
    body: {
      en: "Coordinated design information, structured models and considered digital workflows. Making complexity legible.",
      fa: "اطلاعات هماهنگ طراحی، مدل‌های ساختارمند و فرایندهای دیجیتال سنجیده؛ برای خواناتر کردن پیچیدگی.",
    },
    tags: ["MODEL", "COORDINATE", "INFORM"],
    mode: 2,
  },
  {
    id: "infrastructure",
    number: "03",
    title: { en: "Data center & infrastructure", fa: "دیتاسنتر و زیرساخت" },
    body: {
      en: "Conceptual planning for technical environments. Exploring the relationships between space, circulation, power and cooling.",
      fa: "برنامه‌ریزی مفهومی محیط‌های فنی؛ کاوش در ارتباط میان فضا، گردش، برق و سرمایش.",
    },
    tags: ["POWER", "COOLING", "FLOW"],
    mode: 3,
  },
  {
    id: "digital",
    number: "04",
    title: {
      en: "Computational & digital experiences",
      fa: "طراحی محاسباتی و تجربه‌های دیجیتال",
    },
    body: {
      en: "Interactive tools, visual systems and computational experiments. New ways to see, understand and connect.",
      fa: "ابزارهای تعاملی، سیستم‌های بصری و تجربه‌های محاسباتی؛ راه‌هایی تازه برای دیدن، فهمیدن و پیوند دادن.",
    },
    tags: ["CODE", "INTERACT", "EXPLORE"],
    mode: 1,
  },
];
export interface Project {
  id: string;
  title: Localized;
  category: Localized;
  statement: Localized;
  scope: Localized;
  image: string;
  detailImage: string;
  mode: number;
  status: "concept";
}
export const projects: Project[] = [
  {
    id: "threshold",
    title: { en: "The Open Threshold", fa: "آستانهٔ باز" },
    category: { en: "Spatial experiment", fa: "تجربهٔ فضایی" },
    statement: {
      en: "A self-directed massing study exploring a shared ground plane, open structural bays and a suspended upper volume. The model tests how a simple frame can establish both enclosure and openness.",
      fa: "مطالعه‌ای مستقل دربارهٔ سطح مشترک زمین، دهانه‌های باز و حجم معلق بالایی؛ آزمایشی برای اینکه یک قاب ساده چگونه هم‌زمان محصوربودن و گشودگی ایجاد می‌کند.",
    },
    scope: {
      en: "Procedural massing / spatial relationships / light & structure",
      fa: "حجم‌پردازی رویه‌ای / روابط فضایی / نور و سازه",
    },
    image: "/images/threshold.svg",
    detailImage: "/images/threshold-detail.svg",
    mode: 0,
    status: "concept",
  },
  {
    id: "coordination",
    title: { en: "Layers of Coordination", fa: "لایه‌های هماهنگی" },
    category: { en: "BIM study", fa: "مطالعهٔ BIM" },
    statement: {
      en: "An exploded, diagrammatic building model. Floor plates, structural frames and information layers separate to make their relationships visible. A communication study, rather than a verified BIM deliverable.",
      fa: "مدل دیاگرامی و انفجاری ساختمان؛ صفحات طبقات، قاب‌های سازه و لایه‌های اطلاعات از هم فاصله می‌گیرند تا ارتباطشان خوانا شود. مطالعه‌ای در بیان طراحی، نه یک خروجی تأییدشدهٔ BIM.",
    },
    scope: {
      en: "Layer hierarchy / model legibility / information design",
      fa: "سلسله‌مراتب لایه‌ها / خوانایی مدل / طراحی اطلاعات",
    },
    image: "/images/coordination.svg",
    detailImage: "/images/coordination-detail.svg",
    mode: 2,
    status: "concept",
  },
  {
    id: "infrastructure",
    title: { en: "Infrastructure, Revealed", fa: "زیرساخت، آشکار" },
    category: { en: "Data center concept", fa: "کانسپت دیتاسنتر" },
    statement: {
      en: "A conceptual server hall arrangement that visualizes technical circulation and the distinction between equipment and service space. This illustration does not represent an engineered or certified facility.",
      fa: "چیدمان مفهومی سالن سرور برای نمایش گردش فنی و تمایز فضای تجهیزات و خدمات؛ این تصویر، طرح مهندسی‌شده یا تأییدشدهٔ یک تأسیسات واقعی نیست.",
    },
    scope: {
      en: "Technical zoning / conceptual cooling paths / service access",
      fa: "زون‌بندی فنی / مسیرهای مفهومی سرمایش / دسترسی خدمات",
    },
    image: "/images/infrastructure.svg",
    detailImage: "/images/infrastructure-detail.svg",
    mode: 3,
    status: "concept",
  },
];
export const layers = [
  {
    title: { en: "Spatial planning", fa: "برنامه‌ریزی فضایی" },
    body: {
      en: "Start with people, proportion and the relationship between places. The plan sets the logic.",
      fa: "آغاز با انسان، تناسب و ارتباط میان مکان‌ها؛ پلان، منطق فضا را می‌سازد.",
    },
  },
  {
    title: { en: "Structural coordination", fa: "هماهنگی سازه" },
    body: {
      en: "Frames and floor plates establish a coherent load-bearing rhythm. Structure gives the idea its order.",
      fa: "قاب‌ها و صفحات طبقات، ریتمی منسجم ایجاد می‌کنند؛ سازه به ایده نظم می‌دهد.",
    },
  },
  {
    title: { en: "Infrastructure", fa: "زیرساخت" },
    body: {
      en: "Technical space, service access and conceptual cooling paths connect the building to its operations.",
      fa: "فضاهای فنی، دسترسی خدمات و مسیرهای مفهومی سرمایش، ساختمان را به کارکردش پیوند می‌دهند.",
    },
  },
  {
    title: { en: "Digital information", fa: "اطلاعات دیجیتال" },
    body: {
      en: "A coordinated information layer makes relationships visible and creates a shared language for decisions.",
      fa: "لایهٔ هماهنگ اطلاعات، ارتباط‌ها را نمایان می‌کند و زبانی مشترک برای تصمیم‌گیری می‌سازد.",
    },
  },
];
