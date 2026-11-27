import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BRAND_ROUTES = [
  "/#/",
  "/#/work",
  "/#/work/the-last-shadow-of-time",
  "/#/drawings",
  "/#/about",
  "/#/ventures",
  "/#/ventures/frontier",
  "/#/contact",
];

async function prefs(page: Page, locale: string, theme = "dark") {
  await page.addInitScript(
    ([l, t]) => {
      // Seed once per tab so reloads keep what the test changed.
      if (sessionStorage.getItem("e2e-seeded")) return;
      sessionStorage.setItem("e2e-seeded", "1");
      localStorage.setItem("signal-ai:locale", l);
      localStorage.setItem("signal-ai:theme", t);
    },
    [locale, theme],
  );
}

for (const locale of ["en", "fa"])
  for (const width of [360, 390, 768, 1024, 1440, 1920])
    test(`site routes render without overflow ${locale} ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await prefs(page, locale);
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const route of [...BRAND_ROUTES, "/#/frontier/"]) {
        await page.goto(route);
        await expect(page.locator("main h1"), route).toHaveCount(1);
        await expect(page.locator(".sx-header-in .sx-brand")).toBeVisible();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
          route,
        ).toBeLessThanOrEqual(1);
      }
      await expect(page.locator("html")).toHaveAttribute("dir", locale === "fa" ? "rtl" : "ltr");
      expect(errors).toEqual([]);
    });

for (const locale of ["en", "fa"])
  for (const theme of ["dark", "light"])
    for (const route of [...BRAND_ROUTES, "/#/frontier/"])
      test(`accessibility ${locale} ${theme} ${route}`, async ({ page }) => {
        await prefs(page, locale, theme);
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
            nodes: v.nodes.map((n) => ({ target: n.target, message: n.failureSummary })),
          })),
        ).toEqual([]);
      });

test("header navigation marks the current section and links every page", async ({ page }) => {
  await page.goto("/#/");
  await expect(page.locator("html")).toHaveAttribute("data-site", "brand");
  const nav = page.getByRole("navigation", { name: "Main" }).first();
  for (const [name, url, heading] of [
    ["Work", /#\/work$/, /Work|Projects/],
    ["Drawings", /#\/drawings$/, /Drawing/],
    ["About", /#\/about$/, /About/],
    ["Ventures", /#\/ventures$/, /Ventures/],
    ["Contact", /#\/contact$/, /Contact|talk/i],
  ] as const) {
    await nav.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(url);
    await expect(page.locator("main h1")).toContainText(heading);
    await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute("aria-current", "page");
  }
  await nav.getByRole("link", { name: "FRONTIER", exact: true }).click();
  await expect(page).toHaveURL(/#\/frontier\/$/);
  await expect(page.locator("html")).toHaveAttribute("data-site", "editorial");
  await expect(page.locator(".story-card").first()).toBeAttached();
  await page.locator(".sx-header-in .sx-brand").click();
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.locator("html")).toHaveAttribute("data-site", "brand");
});

test("older links still land on the right pages", async ({ page }) => {
  for (const [from, h1] of [
    ["/#/projects", /Work|Projects/],
    ["/#/projects/the-last-shadow-of-time", /The Last Shadow of Time/],
    ["/#/portfolio", /About/],
    ["/#/expertise", /About/],
    ["/#/lab", /Ventures/],
  ] as const) {
    await page.goto(from);
    await expect(page.locator("main h1"), from).toContainText(h1);
  }
});

test("work index filters projects and opens a project with its story, drawings and gallery", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/work");
  const cards = page.getByTestId("work-card");
  await expect(cards).toHaveCount(3);
  const filters = page.locator(".sx-filter button");
  await filters.nth(1).click();
  await expect(filters.nth(1)).toHaveAttribute("aria-pressed", "true");
  expect(await cards.count()).toBeLessThan(3);
  await filters.first().click();
  await expect(cards).toHaveCount(3);
  await page.getByRole("link", { name: /The Last Shadow of Time/ }).first().click();
  await expect(page).toHaveURL(/#\/work\/the-last-shadow-of-time$/);
  await expect(page.locator("main h1")).toHaveText("The Last Shadow of Time");
  await expect(page.getByTestId("project-credit")).toBeVisible();
  await expect(page.locator(".sx-story-part").first()).toBeVisible();
  await expect(page.getByTestId("plan-viewer")).toBeVisible();
  const shots = page.locator(".sx-gallery button");
  expect(await shots.count()).toBeGreaterThan(6);
  await shots.first().click();
  const box = page.locator("dialog.sx-lightbox");
  await expect(box).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Escape");
  await expect(box).toBeHidden();
  await expect(page.locator(".sx-next a, a.sx-next").first()).toBeVisible();
});

test("plan viewer zooms, fits, switches sheets and keeps the sheet in the URL", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/drawings");
  const viewer = page.getByTestId("plan-viewer");
  const zoom = viewer.getByTestId("zoom-level");
  await expect(zoom).toHaveText(/\d+%/);
  const start = parseInt((await zoom.textContent()) ?? "0", 10);
  await viewer.getByRole("button", { name: "Zoom in" }).click();
  await expect.poll(async () => parseInt((await zoom.textContent()) ?? "0", 10)).toBeGreaterThan(start);
  await viewer.getByRole("button", { name: "Fit to view" }).click();
  await expect.poll(async () => parseInt((await zoom.textContent()) ?? "0", 10)).toBe(start);
  // Keyboard: focus the stage and zoom with +.
  await viewer.locator(".sx-stage").focus();
  await page.keyboard.press("+");
  await expect.poll(async () => parseInt((await zoom.textContent()) ?? "0", 10)).toBeGreaterThan(start);
  await page.keyboard.press("0");
  await expect.poll(async () => parseInt((await zoom.textContent()) ?? "0", 10)).toBe(start);
  // Wheel zoom stays inside the viewer and does not scroll the page.
  const y = await page.evaluate(() => scrollY);
  await viewer.locator(".sx-stage").hover();
  await page.mouse.wheel(0, -400);
  await expect.poll(async () => parseInt((await zoom.textContent()) ?? "0", 10)).toBeGreaterThan(start);
  expect(await page.evaluate(() => scrollY)).toBe(y);
  // Blueprint ink toggle.
  const ink = viewer.getByRole("button", { name: /ink|blueprint/i });
  await ink.click();
  await expect(viewer).toHaveAttribute("data-ink", "blueprint");
  // Choosing a sheet updates the deep link, which survives a reload.
  const second = viewer.locator(".sx-sheets li button").nth(1);
  await second.click();
  await expect(second).toHaveAttribute("aria-current", "true");
  await expect(page).toHaveURL(/#\/drawings\?sheet=/);
  const url = page.url();
  await page.reload();
  expect(page.url()).toBe(url);
  await expect(page.getByTestId("plan-viewer").locator(".sx-sheets li button").nth(1)).toHaveAttribute("aria-current", "true");
});

test("Persian layout is right-to-left with Persian copy and fonts", async ({ page }) => {
  await prefs(page, "fa", "light");
  await page.goto("/#/work/the-last-shadow-of-time");
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("main h1")).toHaveText("آخرین سایه‌ی زمان");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.locator("main h1").evaluate((e) => getComputedStyle(e).fontFamily)).toContain("Vazirmatn");
  await page.locator(".sx-header .sx-lang").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveURL(/#\/work\/the-last-shadow-of-time$/);
  expect(await page.locator("main h1").evaluate((e) => getComputedStyle(e).fontFamily)).toContain("Geist");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(await page.evaluate(() => localStorage.getItem("signal-ai:locale"))).toBe("en");
});

test("theme toggle switches and persists", async ({ page }) => {
  await prefs(page, "en", "dark");
  await page.goto("/#/about");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: /light/i }).first().click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("mobile menu opens as a dialog, traps focus and closes back to its button", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/");
  const opener = page.locator(".sx-menu-btn");
  await opener.click();
  const drawer = page.locator("dialog.sx-drawer");
  await expect(drawer).toBeVisible();
  await expect(opener).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(opener).toBeFocused();
  await opener.click();
  await drawer.getByRole("link", { name: /Drawings/ }).click();
  await expect(page).toHaveURL(/#\/drawings$/);
  await expect(drawer).toBeHidden();
});

test("about page offers the résumé PDF and describes data-center skills without project drawings", async ({ page }) => {
  await page.goto("/#/about");
  const resume = page.locator(".studio-resume-link");
  await expect(resume).toHaveAttribute("href", /MohammadAmin_Sadeghi_Resume\.pdf$/);
  const response = await page.request.get("/documents/MohammadAmin_Sadeghi_Resume.pdf");
  expect(response.status()).toBe(200);
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  await expect(page.locator(".sx-capability")).toBeVisible();
  await expect(page.locator(".sx-capability img")).toHaveCount(0);
});

test("withdrawn confidential projects are gone from every listing and route", async ({ page }) => {
  for (const slug of [
    "modular-data-centre",
    "two-level-facility",
    "technical-level-48-racks",
    "rack-room-reorganisation",
    "existing-hall-conversion",
    "data-hall-retrofit",
  ]) {
    await page.goto(`/#/work/${slug}`);
    await expect(page.locator("main")).not.toContainText(/rack|data hall/i);
    // The preview server answers unknown paths with the app shell, so check the type.
    const res = await page.request.get(`/work-media/images/pp-${slug}-01.webp`);
    expect(res.headers()["content-type"] ?? "", slug).not.toContain("image");
  }
  await page.goto("/#/drawings");
  const ids = await page.locator(".sx-sheets li small").allTextContents();
  expect(ids.join(" ")).not.toMatch(/data-hall|rack/i);
});

test("ventures link FRONTIER inside the site and the other products outside it", async ({ page }) => {
  await page.goto("/#/ventures");
  await expect(page.locator(".sx-venture")).toHaveCount(4);
  const external = page.locator(".sx-venture[target=_blank]");
  for (const a of await external.all()) await expect(a).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.locator('.sx-venture[href="https://archvanta.github.io/cheghad/"]')).toHaveCount(1);
  await page.locator(".sx-venture--lead").click();
  await expect(page).toHaveURL(/#\/ventures\/frontier$/);
  await expect(page.getByTestId("frontier-stats")).toBeVisible();
  await page.getByRole("link", { name: /Open FRONTIER|Visit FRONTIER|Open the site/i }).first().click();
  await expect(page).toHaveURL(/#\/frontier\//);
});

test("global search covers portfolio and FRONTIER articles", async ({ page }) => {
  await page.goto("/#/search?q=museum");
  await expect(page.locator(".av-search-results").first()).toContainText("The Last Shadow of Time");
  await page.goto("/#/search?q=OpenAI");
  await expect(page.locator(".av-search-results")).toContainText("FRONTIER");
  await page.locator(".av-search-results a").first().click();
  await expect(page).toHaveURL(/#\/frontier\/story\//);
});

test("FRONTIER saved stories survive route changes and reload", async ({ page }) => {
  await page.goto("/#/frontier/");
  await expect(page.locator(".story-card").first()).toBeAttached();
  await page.locator(".story-card").first().getByRole("button", { name: "Save story", exact: true }).click();
  await page.goto("/#/frontier/saved");
  await page.reload();
  await expect(page.locator("[data-testid=saved-row]")).toHaveCount(1);
  await page.locator(".sx-header-in .sx-brand").click();
  await expect(page.locator("html")).toHaveAttribute("data-site", "brand");
  await page.goto("/#/frontier/saved");
  await expect(page.locator("[data-testid=saved-row]")).toHaveCount(1);
});

test("FRONTIER discovery routes and source attribution keep working", async ({ page }) => {
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
    await expect(page.locator("main h1"), route).toHaveCount(1);
  }
  await page.goto("/#/picks/weekly");
  await expect(page.locator("main h1")).toContainText("Weekly");
  await page.goto("/#/frontier/");
  await expect(page.locator(".nh-slide.is-active a[target=_blank]").first()).toHaveAttribute("rel", "noopener noreferrer");
});

test("3D models stay behind an explicit request", async ({ page }) => {
  const glb: string[] = [];
  page.on("request", (r) => {
    if (/\.(glb|obj)$/i.test(r.url())) glb.push(r.url());
  });
  await page.goto("/#/ventures");
  const model = page.locator('a[href^="#/lab/"]').first();
  await expect(model).toBeVisible();
  expect(glb).toEqual([]);
  await model.click();
  await expect(page).toHaveURL(/#\/lab\//);
  await expect(page.locator("main h1")).toHaveCount(1);
});

test("social and icon metadata point at the new brand files", async ({ page }) => {
  await page.goto("/#/");
  for (const path of ["/archvanta-icon.svg", "/favicon.png", "/apple-touch-icon.png", "/social-preview.png"]) {
    const res = await page.request.get(path);
    expect(res.status(), path).toBe(200);
  }
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute("href", /archvanta-icon\.svg/);
  await expect(page).toHaveTitle(/ARCHVANTA/);
});
