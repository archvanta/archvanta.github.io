import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const language of ["en", "fa"] as const) {
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    test(`${language} layout at ${width}px`, async ({ page }) => {
      await page.addInitScript(
        (l) => localStorage.setItem("archvanta:language", l),
        language,
      );
      await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("html")).toHaveAttribute("lang", language);
      await expect(page.locator("html")).toHaveAttribute(
        "dir",
        language === "fa" ? "rtl" : "ltr",
      );
      await expect(page.locator("h1")).toHaveCount(1);
      for (const id of [
        "home",
        "expertise",
        "work",
        "systems",
        "lab",
        "about",
        "contact",
      ])
        await expect(page.locator(`#${id}`)).toBeAttached();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBeLessThanOrEqual(1);
      for (const id of ["work", "lab", "contact"]) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth - innerWidth,
          ),
          id,
        ).toBeLessThanOrEqual(1);
      }
      expect(errors).toEqual([]);
    });
  }
  for (const theme of ["dark", "light"]) {
    test(`accessibility ${theme} ${language}`, async ({ page }) => {
      await page.addInitScript(
        ({ l, t }) => {
          localStorage.setItem("archvanta:language", l);
          localStorage.setItem("archvanta:theme", t);
        },
        { l: language, t: theme },
      );
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
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
  }
}
test("preferences persist and reduced motion leaves every section visible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "فا — تغییر زبان به فارسی" }).click();
  await page.getByRole("button", { name: "تغییر به تم روشن" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.locator("[data-reveal=pending]").count()).toBe(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("آینده");
});
test("desktop navigation and mobile keyboard navigation work", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const id of ["expertise", "work", "lab", "about", "contact"]) {
    await page.locator(`.desktop-nav a[href="#${id}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    expect(
      await page
        .locator(`#${id}`)
        .evaluate((el) => el.getBoundingClientRect().top),
    ).toBeGreaterThanOrEqual(68);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.locator(".mobile-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".mobile-menu")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator('.mobile-menu a[href="#work"]').click();
  await expect(page.locator(".mobile-menu")).not.toBeVisible();
  await expect(page).toHaveURL(/#work$/);
});
test("model modes, expertise, project filters and project dialog work", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .getByRole("button", { name: "04 Infrastructure", exact: true })
    .click();
  await expect(page.locator(".hero .model-mode-3")).toHaveCount(1);
  await page
    .getByRole("button", { name: "BIM & digital construction", exact: true })
    .click();
  await expect(page.locator("#expertise-bim")).toBeVisible();
  await page.getByRole("button", { name: "BIM study", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: /Open study:.*Layers of Coordination/ })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page
      .locator(".project-dialog")
      .getByRole("heading", { name: "Layers of Coordination", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: /All studies/ }).click();
  await expect(page.locator(".project-card")).toHaveCount(3);
  await page
    .getByRole("button", { name: "04 Digital information", exact: true })
    .click();
  await expect(page.locator("#layer-description")).toContainText(
    "shared language",
  );
});
test("all assets resolve, outbound links are correct and no fictitious contact exists", async ({
  page,
  request,
}) => {
  await page.goto("/");
  for (const image of await page
    .locator("img")
    .evaluateAll((imgs) => imgs.map((i) => i.getAttribute("src")!))) {
    const r = await request.get(image);
    expect(r.status(), image).toBe(200);
  }
  for (const link of await page.locator('a[target="_blank"]').all())
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  await expect(
    page.getByRole("link", { name: /Explore FRONTIER/ }).first(),
  ).toHaveAttribute("href", "https://archvanta.github.io/frontier/#/");
  expect(await page.locator('a[href^="mailto:"]').count()).toBe(0);
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    "https://archvanta.github.io/",
  );
});
