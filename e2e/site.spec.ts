import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const locale of ["en", "fa"])
  for (const width of [360, 390, 768, 1024, 1440, 1920])
    test(`unified routes and layout ${locale} ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(
        (l) => localStorage.setItem("signal-ai:locale", l),
        locale,
      );
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const route of [
        "/#/",
        "/#/projects",
        "/#/frontier/",
        "/#/portfolio",
      ]) {
        await page.goto(route);
        await expect(page.locator("main h1")).toHaveCount(1);
        await expect(page.locator(".av-wordmark")).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth - innerWidth,
          ),
          route,
        ).toBeLessThanOrEqual(1);
      }
      await expect(page.locator("html")).toHaveAttribute(
        "dir",
        locale === "fa" ? "rtl" : "ltr",
      );
      expect(errors).toEqual([]);
    });
for (const locale of ["en", "fa"])
  for (const theme of ["dark", "light"])
    for (const route of [
      "/#/",
      "/#/projects",
      "/#/projects/modular-data-centre",
      "/#/frontier/",
      "/#/portfolio",
    ])
      test(`accessibility ${locale} ${theme} ${route}`, async ({ page }) => {
        await page.addInitScript(
          ({ locale, theme }) => {
            localStorage.setItem("signal-ai:locale", locale);
            localStorage.setItem("signal-ai:theme", theme);
          },
          { locale, theme },
        );
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(route);
        await expect(page.locator("main h1")).toHaveCount(1);
        await page.waitForLoadState("networkidle");
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        expect(
          result.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              message: n.failureSummary,
            })),
          })),
        ).toEqual([]);
      });
test("one shell connects home, portfolio, projects and editorial deep links", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("h1")).toHaveAccessibleName("ARCHVANTA");
  await page.getByRole("button", { name: "Skip to projects" }).click();
  await page.getByRole("link", { name: "All projects", exact: true }).last().click();
  await expect(page).toHaveURL(/#\/projects$/);
  await expect(page.locator(".av-project-card")).toHaveCount(12);
  const projectCovers = await page
    .locator(".av-project-card img")
    .evaluateAll((images) => images.map((image) => image.getAttribute("src")));
  expect(projectCovers.length).toBeGreaterThan(0);
  for (const src of projectCovers) {
    expect(src).toMatch(/^\/(work-media\/images|images)\//);
    expect((await page.request.get(src!)).status()).toBe(200);
  }
  await page.locator(".av-project-card").first().getByRole("link").click();
  await expect(page).toHaveURL(/#\/projects\/modular-data-centre$/);
  await page.reload();
  await expect(page.locator("h1")).toHaveText("Modular Data Center");
  await expect(page.locator(".av-gallery figure")).toHaveCount(8);
  await page.locator(".av-gallery button").first().click();
  await expect(page.locator(".av-lightbox")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".av-lightbox")).not.toBeVisible();
  await page.locator(".av-global-nav a", { hasText: "FRONTIER" }).click();
  await expect(page.locator(".av-editorial")).toBeVisible();
  await expect(page.locator("#top-signals")).toBeVisible();
  await page.locator(".nh-slide.is-active .nh-actions a").first().click();
  await expect(page).toHaveURL(/#\/frontier\/story\//);
  await page.reload();
  await expect(page.locator("main h1")).toHaveCount(1);
  await page.goBack();
  await expect(page.locator(".av-editorial")).toBeVisible();
});
test("project categories and concepts remain distinct; proposals and credits survive", async ({
  page,
}) => {
  await page.goto("/#/projects?category=concepts");
  await expect(page.locator(".av-project-card")).toHaveCount(3);
  await expect(page.locator(".av-project-card small").first()).toContainText(
    "Concept",
  );
  await page.goto("/#/projects/two-level-facility");
  await expect(page.locator(".av-project-description")).toContainText(
    "three-person",
  );
  await expect(page.locator(".av-proposal")).toHaveAttribute("open", "");
  await expect(page.locator(".av-proposal figure")).toHaveCount(9);
  for (const src of await page
    .locator(".av-proposal img")
    .evaluateAll((imgs) => imgs.map((i) => i.getAttribute("src")!))) {
    expect((await page.request.get(src)).status()).toBe(200);
  }
});
test("local saved stories survive canonical route changes and reload", async ({
  page,
}) => {
  await page.goto("/#/frontier/");
  await expect(page.locator(".story-card").first()).toBeAttached();
  await page
    .locator(".story-card")
    .first()
    .getByRole("button", { name: "Save story", exact: true })
    .click();
  await page.goto("/#/frontier/saved");
  await page.reload();
  await expect(page.locator("[data-testid=saved-row]")).toHaveCount(1);
  await page.locator(".av-wordmark").click();
  await expect(page.locator("h1")).toHaveAccessibleName("ARCHVANTA");
  await page.goto("/#/frontier/saved");
  await expect(page.locator("[data-testid=saved-row]")).toHaveCount(1);
});
test("global search covers both portfolio and real article adapter", async ({
  page,
}) => {
  await page.goto("/#/search?q=modular");
  await expect(page.locator(".av-search-results").first()).toContainText(
    "Modular Data Center",
  );
  await page.goto("/#/search?q=OpenAI");
  await expect(page.locator(".av-search-results")).toContainText("FRONTIER");
  await page.locator(".av-search-results a").first().click();
  await expect(page).toHaveURL(/#\/frontier\/story\//);
});
test("theme/language migrate once and keep context across all routes", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("archvanta:language", "fa");
    localStorage.setItem("archvanta:theme", "light");
  });
  await page.goto("/#/projects/modular-data-centre");
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "EN — English (انگلیسی)" }).click();
  await expect(page).toHaveURL(/#\/projects\/modular-data-centre$/);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(
    await page.evaluate(() => localStorage.getItem("signal-ai:locale")),
  ).toBe("en");
});
test("mobile nested navigation and keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(page.locator(".av-mobile-menu")).toBeVisible();
  await page
    .locator(".av-mobile-menu")
    .getByRole("button", { name: "Projects", exact: true })
    .click();
  await page
    .locator(".av-mobile-menu")
    .getByRole("link", { name: /All projects/ })
    .click();
  await expect(page).toHaveURL(/#\/projects$/);
  await expect(page.locator(".av-mobile-menu")).not.toBeVisible();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Menu", exact: true }),
  ).toBeFocused();
});
test("lab tools are preserved and WebGL is not loaded until requested", async ({
  page,
}) => {
  await page.goto("/#/lab");
  await expect(page.locator(".av-lab-item")).toHaveCount(5);
  await page.locator(".av-lab-item").nth(1).click();
  await expect(page.locator(".av-model-launch")).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.locator(".av-model-launch").click();
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    "/work-media/models/obj-server-rack-800x1200x2040.html",
  );
  expect(
    (
      await page.request.get(
        "/work-media/models/obj-server-rack-800x1200x2040.html",
      )
    ).status(),
  ).toBe(200);
});
test("editorial discovery routes, source attribution and legacy root aliases work", async ({
  page,
}) => {
  for (const route of [
    "/#/frontier/picks/weekly",
    "/#/frontier/archive",
    "/#/frontier/sources",
    "/#/frontier/explore?q=OpenAI",
    "/#/frontier/ai-games",
    "/#/frontier/data-centers",
    "/#/frontier/videos",
  ]) {
    await page.goto(route);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator(".av-editorial")).toBeVisible();
  }
  await page.goto("/#/picks/weekly");
  await expect(page.locator("main h1")).toContainText("Weekly");
  await page.goto("/#/frontier/");
  await expect(
    page.locator(".nh-slide.is-active a[target=_blank]").first(),
  ).toHaveAttribute("rel", "noopener noreferrer");
});
test("liquid navigation preserves disclosures, route focus and CSP", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const blocked: string[] = [];
  await page.exposeFunction("recordCsp", (directive: string) =>
    blocked.push(directive),
  );
  await page.addInitScript(() =>
    document.addEventListener("securitypolicyviolation", (e) =>
      (window as unknown as { recordCsp: (d: string) => void }).recordCsp(
        e.violatedDirective,
      ),
    ),
  );
  await page.goto("/");
  await expect(page.locator(".nimbus-nav canvas")).toHaveCount(0);
  await expect(page.locator(".nimbus-nav .nimbus-drop")).toHaveCount(1);
  await page.getByRole("button", { name: "Skip to projects" }).click();
  await expect(page.locator(".project-headlines").first()).toBeInViewport();
  await page
    .locator(".nimbus-nav")
    .getByRole("button", { name: "Projects", exact: true })
    .click();
  await page
    .locator(".nimbus-nav")
    .getByRole("link", { name: /All projects/ })
    .click();
  await expect(page).toHaveURL(/#\/projects$/);
  await page.locator(".nimbus-nav a").first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page
      .locator(".nimbus-nav")
      .getByRole("button", { name: "Expertise", exact: true }),
  ).toBeFocused();
  expect(blocked).toEqual([]);
});
test("project headlines appear near the end of home and link to the selected project", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const carousel = page.locator(".project-headlines").first();
  await expect(carousel.locator('.ph-title')).toBeVisible();
  await expect(page.locator('.circular-testimonials')).toHaveCount(0);
  expect(await page.evaluate(() => {
    const section = document.querySelector('#selected-work')!;
    return document.querySelector('#process')!.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING;
  })).toBeTruthy();
  await expect(carousel.locator(".ph-title")).toHaveText("Modular Data Center");
  await carousel.getByRole("button", { name: "Next project" }).click();
  await expect(carousel.locator(".ph-title")).toHaveText("Technical Level, 48 Racks");
  await carousel.getByRole("link", { name: "Explore project" }).click();
  await expect(page).toHaveURL(/#\/projects\/technical-level-48-racks$/);
});
test("opening is a permanent scroll chapter, skips to projects and stays off deep links", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".parallax")).toBeVisible();
  await expect(page.locator("[data-parallax-layer]")).toHaveCount(4);
  await expect(page.locator(".expertise .brand-glyph")).toHaveCount(4);
  await page.getByRole("button", { name: "Skip to projects" }).click();
  await expect(page.locator(".project-headlines").first()).toBeInViewport();
  await expect(page.locator(".parallax")).toHaveCount(1);
  await page.evaluate(() => (location.hash = "#/projects"));
  await expect(page.locator("main h1")).toHaveText("Projects");
  await expect(page.locator(".parallax")).toHaveCount(0);
  await page.evaluate(() => (location.hash = "#/"));
  await expect(page.locator(".parallax")).toBeVisible();
  await page.goto("/#/projects");
  await expect(page.locator(".parallax")).toHaveCount(0);
});

test("parallax layers reverse on upward scroll and release smooth scrolling on route changes", async ({ page }) => {
  const computerMedia: string[] = [];
  page.on("request", request => {
    if (/frontier-hero\.(mp4|webp)|frontier-hero-poster/.test(request.url())) computerMedia.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const opening = page.locator(".parallax");
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await expect(page.locator('h1')).toHaveAccessibleName('ARCHVANTA');
  await page.evaluate(() => window.scrollTo(0, 450));
  const offsets = () => page.locator('[data-parallax-layer]').evaluateAll(elements => elements.map(e => new DOMMatrixReadOnly(getComputedStyle(e).transform).m42));
  await expect.poll(async () => (await offsets())[0]).toBeGreaterThan(20);
  const positions = await offsets();
  expect(positions[0]).toBeGreaterThan(positions[1]);
  expect(positions[1]).toBeGreaterThan(positions[2]);
  expect(positions[2]).toBeGreaterThan(positions[3]);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(async () => Math.abs((await offsets())[0])).toBeLessThan(1);
  await expect(page.locator('.statue-title')).toBeInViewport();
  expect(computerMedia).toEqual([]);
  await expect(opening.locator("video")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.goto('/#/projects');
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await expect(opening).toHaveAttribute('data-motion', 'reduced');
});

test("shared English and Persian fonts are loaded and used by form controls", async ({ page }) => {
  await page.goto("/#/projects");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.locator("body").evaluate(e => getComputedStyle(e).fontFamily)).toContain("Inter Variable");
  await page.addInitScript(() => localStorage.setItem("signal-ai:locale", "fa"));
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  expect(await page.locator("body").evaluate(e => getComputedStyle(e).fontFamily)).toContain("Vazirmatn Variable");
  expect(await page.locator("#site-search").evaluate(e => getComputedStyle(e).fontFamily)).toContain("Vazirmatn Variable");
});

test('uploaded portfolio proposals stay complete, with uniform drawing frames and résumé access', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const proposals: [string, number][] = [['two-level-facility',9],['technical-level-48-racks',19],['rack-room-reorganisation',14],['existing-hall-conversion',25],['data-hall-retrofit',14],['ramsar-urban-baseline-study',38]];
  for (const [slug, count] of proposals) {
    await page.goto(`/#/projects/${slug}`);
    await expect(page.locator('.av-proposal')).toHaveAttribute('open', '');
    await expect(page.locator('.av-proposal figure')).toHaveCount(count);
  }
  await page.goto('/#/projects/modular-data-centre');
  const frames = page.locator('.av-gallery button');
  await expect(frames).toHaveCount(8);
  const heights = await frames.evaluateAll(elements => elements.map(e => e.getBoundingClientRect().height));
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
  await expect(page.locator('.project-deliverables')).toBeVisible();
  await page.goto('/#/portfolio');
  const resume = page.locator('.studio-resume-link');
  await expect(resume).toHaveAttribute('download', 'MohammadAmin_Sadeghi_Resume.pdf');
  const response = await page.request.get('/documents/MohammadAmin_Sadeghi_Resume.pdf');
  expect(response.status()).toBe(200);
  expect((await response.body()).subarray(0,5).toString()).toBe('%PDF-');
  await expect(page.locator('.cheghad-link')).toHaveAttribute('href','https://archvanta.github.io/cheghad/');
});

test('minimal discipline symbols and restored system layers work; header stays outside page motion', async ({ page }) => {
  await page.goto('/');
  // The development-only fixture banner is absent from the published shell.
  await page.evaluate(() => document.querySelector('.mock-banner')?.remove());
  await expect(page.locator('.statue-composition')).toHaveAttribute('data-ready','true');
  await expect(page.locator('.brand-glyph').first()).toHaveAttribute('viewBox','0 0 48 48');
  await expect(page.locator('.brand-glyph img, .generated-system-stage')).toHaveCount(0);
  await expect(page.locator('.av-header')).toHaveCSS('view-transition-name','site-header');
  const group = page.getByRole('group', { name: 'Design layers' });
  await group.scrollIntoViewIfNeeded();
  for (let i=0;i<4;i++) {
    await group.getByRole('button').nth(i).click();
    const model = page.locator('.systems-visual .architectural-model');
    await expect(model).toHaveClass(`architectural-model model-mode-${[0,1,3,2][i]}`);
    expect((await model.boundingBox())!.width).toBeGreaterThan(200);
  }
  await expect(page.locator('.studio-signature-name')).toHaveCount(0);
  await page.evaluate(() => {
    const root = window as typeof window & { headerSamples: number[]; stopHeaderSampling: boolean };
    root.headerSamples=[]; root.stopHeaderSampling=false;
    const sample = () => { root.headerSamples.push(document.querySelector('.av-header')!.getBoundingClientRect().top); if(!root.stopHeaderSampling) requestAnimationFrame(sample); }; sample();
  });
  for (const label of ['Digital Lab','About','Contact','Home']) await page.locator('.av-global-nav').getByRole('link',{name:label,exact:true}).click();
  const samples=await page.evaluate(()=>{const root=window as typeof window & {headerSamples:number[];stopHeaderSampling:boolean};root.stopHeaderSampling=true;return root.headerSamples});
  expect(Math.max(...samples)-Math.min(...samples)).toBeLessThan(1);
});

test("studio actions connect real projects, discipline pages and model tools", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('.studio-hero-actions').getByRole('link', { name: 'Explore projects' }).click();
  await expect(page).toHaveURL(/#\/projects$/);
  const count = await page.locator('.av-project-card').count();
  await expect(page.locator('.work-filters a').first().locator('.studio-filter-count')).toHaveText(String(count));
  await page.goto('/');
  await page.locator('.studio-discipline-index a').nth(2).click();
  await expect(page).toHaveURL(/#\/expertise\/infrastructure$/);
  await page.goto('/');
  await page.locator('.studio-hero-actions').getByRole('link', { name: 'Enter the Lab' }).click();
  await expect(page).toHaveURL(/#\/lab$/);
  await expect(page.locator('.studio-lab-schematic')).toHaveCount(5);
  await page.locator('.av-lab-item').nth(1).click();
  await expect(page.locator('.av-model-launch')).toBeVisible();
  await expect(page.locator('.av-model-view iframe')).toHaveCount(0);
  await page.goto('/#/contact');
  await page.locator('.back-top').scrollIntoViewIfNeeded();
  await page.locator('.back-top').click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page).toHaveURL(/#\/contact$/);
});
