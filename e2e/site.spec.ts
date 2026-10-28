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
  await page.locator(".av-proposal summary").click();
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
  await expect(page.locator(".circular-testimonials").first()).toBeInViewport();
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
test("circular project stories switch locally without capturing page arrow keys", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const carousel = page.locator(".circular-testimonials").first();
  await expect(carousel.locator("h3")).toHaveText("Modular Data Center");
  await carousel.getByRole("button", { name: "Next project" }).click();
  await expect(carousel.locator("h3")).toHaveText("Technical Level, 48 Racks");
  await carousel.getByRole("link", { name: "Explore project" }).click();
  await expect(page).toHaveURL(/#\/projects\/technical-level-48-racks$/);
});
test("opening is a permanent scroll chapter, skips to projects and stays off deep links", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".old-masters-preloader")).toBeVisible();
  await expect(page.locator(".om-opening-intro")).toBeAttached();
  await expect(page.locator(".om-opening-hero")).toHaveCount(0);
  await expect(page.locator(".om-opening-system .brand-glyph")).toHaveCount(4);
  await page.getByRole("button", { name: "Skip to projects" }).click();
  await expect(page.locator(".circular-testimonials").first()).toBeInViewport();
  await expect(page.locator(".old-masters-preloader")).toHaveCount(1);
  await page.evaluate(() => (location.hash = "#/projects"));
  await expect(page.locator("main h1")).toHaveText("Projects");
  await expect(page.locator(".old-masters-preloader")).toHaveCount(0);
  await page.evaluate(() => (location.hash = "#/"));
  await expect(page.locator(".old-masters-preloader")).toBeVisible();
  await page.goto("/#/projects");
  await expect(page.locator(".old-masters-preloader")).toHaveCount(0);
});

test("statue scene stays intact when scrolling down and back, without computer media", async ({ page }) => {
  const computerMedia: string[] = [];
  page.on("request", request => {
    if (/frontier-hero\.(mp4|webp)|frontier-hero-poster/.test(request.url())) computerMedia.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const opening = page.locator(".av-opening");
  await expect(opening).toHaveAttribute("data-ready", "true");
  await page.locator(".om-opening-disciplines").scrollIntoViewIfNeeded();
  await page.locator(".om-opening-stage").evaluate(e => window.scrollTo(0, e.getBoundingClientRect().bottom + window.scrollY + 1));
  await expect(page.locator(".om-opening-stage")).not.toBeInViewport();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator(".om-opening-intro")).toBeInViewport();
  await expect(opening).toHaveAttribute("data-ready", "true");
  await expect(page.locator(".om-opening-cast img")).toHaveCount(3);
  await expect(page.locator(".om-opening-intro")).toHaveCSS("opacity", "1");
  expect(computerMedia).toEqual([]);
  await expect(opening.locator("video")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.locator(".om-opening-disciplines a").first().click();
  await expect(page).toHaveURL(/#\/expertise\/architecture$/);
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
