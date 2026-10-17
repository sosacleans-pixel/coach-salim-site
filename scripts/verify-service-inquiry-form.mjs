import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const ART = '/opt/cursor/artifacts';
const PORT = 8765;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let path = req.url.split('?')[0];
      if (path === '/') path = '/index.html';
      const filePath = join(ROOT, path);
      if (!existsSync(filePath) || !filePath.startsWith(ROOT)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(readFileSync(filePath));
    });
    server.listen(PORT, () => resolve(server));
  });
}

const SERVICES = [
  { slug: 'fitness-nutrition-text', title: 'Fitness, Nutrition & Accountability via Text', linkText: 'Ask about this program' },
  { slug: 'balanced-wellness-monthly', title: 'Balanced Wellness Monthly', linkText: 'Ask about this program' },
  { slug: 'balanced-wellness-6-month', title: 'Balanced Wellness 6-Month', linkText: 'Ask about this program' },
  { slug: 'utah-training', title: 'Utah Training', linkText: 'Ask about Utah training' },
];

async function scrollToContact(page) {
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
}

async function getServiceReadonly(page) {
  return page.locator('#cf-service-readonly');
}

async function runServicePrefillTests(page, viewportName) {
  const results = [];
  for (const svc of SERVICES) {
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
    const link = page.locator(`.card[data-service-slug="${svc.slug}"] .card-link`);
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await page.waitForURL(`**/*service=${svc.slug}*`);
    await scrollToContact(page);
    const ro = await getServiceReadonly(page);
    await ro.waitFor({ state: 'visible' });
    const value = await ro.inputValue();
    const ok = value === svc.title;
    results.push({ slug: svc.slug, expected: svc.title, actual: value, ok, viewport: viewportName });
  }
  return results;
}

async function testValidation(page, width, height, tag) {
  await page.setViewportSize({ width, height });
  await page.goto(`http://127.0.0.1:${PORT}/?service=utah-training#contact`, { waitUntil: 'networkidle' });
  await scrollToContact(page);

  const form = page.locator('.cform');
  await form.locator('#cf-name').fill('A');
  await form.locator('#cf-email').fill('not-an-email');
  await form.locator('#cf-phone').fill('123');
  await form.locator('#cf-msg').fill('');
  await form.locator('button[type="submit"]').click();
  await page.waitForTimeout(200);

  const errors = await page.locator('.cf-field.is-invalid').count();
  const blocked = errors >= 3;

  await page.screenshot({ path: `${ART}/validation-errors-${tag}.png`, fullPage: false });

  await form.locator('#cf-name').fill('Alex Runner');
  await form.locator('#cf-email').fill('alex@example.com');
  await form.locator('#cf-phone').fill('(801) 555-1234');
  await form.locator('#cf-msg').fill('Interested in Utah training.');

  await page.evaluate(() => {
    window.__capturedFormPayload = null;
    const form = document.querySelector('.cform');
    form.addEventListener(
      'submit',
      (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const fields = {};
        fd.forEach((v, k) => {
          fields[k] = v;
        });
        window.__capturedFormPayload = fields;
      },
      { once: true }
    );
  });

  await form.locator('button[type="submit"]').click();
  await page.waitForTimeout(300);
  const intercepted = await page.evaluate(() => window.__capturedFormPayload);

  return { blocked, errors, intercepted, tag };
}

async function main() {
  const server = await startServer();
  const browser = await chromium.launch();
  const consoleErrors = [];

  const page = await browser.newPage();
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const t = msg.text();
    if (/googletagmanager|google-analytics|403/i.test(t)) return;
    consoleErrors.push(t);
  });
  page.on('pageerror', (err) => consoleErrors.push(String(err)));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`http://127.0.0.1:${PORT}/#programs`, { waitUntil: 'networkidle' });
  await page.locator('.card').first().screenshot({ path: `${ART}/service-card.png` });

  const prefillDesktop = await runServicePrefillTests(page, '1440x900');
  await page.goto(`http://127.0.0.1:${PORT}/?service=balanced-wellness-monthly#contact`, { waitUntil: 'networkidle' });
  await scrollToContact(page);
  await page.screenshot({ path: `${ART}/prefilled-form-desktop.png` });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`http://127.0.0.1:${PORT}/?service=balanced-wellness-monthly#contact`, { waitUntil: 'networkidle' });
  await scrollToContact(page);
  await page.screenshot({ path: `${ART}/prefilled-form-mobile.png` });

  const prefillMobile = await runServicePrefillTests(page, '390x844');

  const valDesktop = await testValidation(page, 1440, 900, 'desktop');
  const valMobile = await testValidation(page, 390, 844, 'mobile');

  if (valDesktop.intercepted) {
    const text = [
      'POST https://formsubmit.co/coachsalimheyaime@gmail.com',
      '(Captured via FormData on submit; network request not sent.)',
      '',
      JSON.stringify(valDesktop.intercepted, null, 2),
    ].join('\n');
    writeFileSync(`${ART}/intercepted-payload.txt`, text, 'utf8');
  }

  const report = {
    prefillDesktop,
    prefillMobile,
    validation: { desktop: { blocked: valDesktop.blocked, errorFields: valDesktop.errors }, mobile: { blocked: valMobile.blocked, errorFields: valMobile.errors } },
    consoleErrors,
    payloadSaved: !!valDesktop.intercepted,
  };

  writeFileSync(`${ART}/playwright-report.json`, JSON.stringify(report, null, 2));

  await browser.close();
  server.close();

  const allOk = [...prefillDesktop, ...prefillMobile].every((r) => r.ok) && valDesktop.blocked && valMobile.blocked && consoleErrors.length === 0;
  console.log(JSON.stringify(report, null, 2));
  if (!allOk) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
