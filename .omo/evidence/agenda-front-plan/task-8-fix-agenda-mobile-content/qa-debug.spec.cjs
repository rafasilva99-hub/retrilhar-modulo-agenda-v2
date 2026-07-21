const { test } = require('playwright/test');

const baseUrl = 'http://127.0.0.1:5191/';
const evidenceDir = '.omo/evidence/agenda-front-plan/task-8-fix-agenda-mobile-content';

function collectGeometry(page, route) {
  return page.evaluate((routeName) => {
    const rect = (element) => {
      if (!element) return null;
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        tag: element.tagName,
        name: element.getAttribute('data-name'),
        role: element.getAttribute('role'),
        className: element.className,
        x: Math.round(box.x * 100) / 100,
        y: Math.round(box.y * 100) / 100,
        width: Math.round(box.width * 100) / 100,
        height: Math.round(box.height * 100) / 100,
        right: Math.round(box.right * 100) / 100,
        bottom: Math.round(box.bottom * 100) / 100,
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
        display: style.display,
        flexWrap: style.flexWrap,
        flexDirection: style.flexDirection,
        gridTemplateColumns: style.gridTemplateColumns,
        minWidth: style.minWidth,
        maxWidth: style.maxWidth,
        whiteSpace: style.whiteSpace,
        overflow: style.overflow,
      };
    };
    const root = document.querySelector(`[data-name^="AGENDA"]`);
    const selectors = routeName === 'agenda'
      ? {
          root: '[data-name="AGENDA - MÊS"]',
          header: '[data-name="AGENDA - MÊS"] > [class*="top-[112px]"]',
          kpi: '[data-name="AGENDA - MÊS"] > [class*="top-[192px]"]',
          calendar: '[data-name="AGENDA - MÊS"] > [class*="top-[363px]"]',
          calendarBody: '[data-name="AGENDA - MÊS"] [data-name="CalendarBody"]',
          content: '[data-name="AGENDA - MÊS"] [data-name="Content"]',
        }
      : {
          root: '[data-name="AGENDA - ATIVIDADES DO DIA"]',
          header: '[data-name="AGENDA - ATIVIDADES DO DIA"] > [class*="top-[148px]"]',
          search: '[data-name="AGENDA - ATIVIDADES DO DIA"] > [class*="top-[234px]"]',
          activities: '[data-name="AGENDA - ATIVIDADES DO DIA"] > [class*="top-[290px]"]',
          cards: '[data-name="AGENDA - ATIVIDADES DO DIA"] [role="link"]',
        };
    const report = { route: routeName, viewport: { width: innerWidth, height: innerHeight }, document: { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }, shell: rect(document.querySelector('.prototype-shell-surface')), root: rect(root) };
    for (const [key, selector] of Object.entries(selectors)) {
      const elements = [...document.querySelectorAll(selector)];
      report[key] = elements.slice(0, 8).map((element) => rect(element));
      if (key === 'cards') {
        report.cardChildren = elements.slice(0, 3).map((card) => [...card.querySelectorAll(':scope > div > div')].map((element) => rect(element)));
        report.badges = elements.slice(0, 3).flatMap((card) => [...card.querySelectorAll('[class*="border-[0.5px]"]')].map((element) => rect(element)));
      }
    }
    return report;
  }, route);
}

test.describe('agenda mobile clipping baseline', () => {
  test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });

  for (const route of ['agenda', 'agendaDia']) {
    test(`${route} baseline`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(`console: ${message.text()}`);
      });
      await page.goto(`${baseUrl}#${route}`, { waitUntil: 'networkidle' });
      await page.locator(`[data-name^="AGENDA"]`).first().waitFor();
      const report = await collectGeometry(page, route);
      report.errors = errors;
      console.log(JSON.stringify(report));
      await page.screenshot({ path: `${evidenceDir}/baseline-390-${route}.png`, fullPage: false });
    });
  }
});
