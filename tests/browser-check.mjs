import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
page.setDefaultTimeout(10000);
await page.route('https://fonts.googleapis.com/**', route => route.abort());
await page.route('https://fonts.gstatic.com/**', route => route.abort());
const errors = [];
page.on('pageerror', e => errors.push(e.message));
const base = process.env.TEST_URL || 'http://127.0.0.1:4173/';
await page.goto(base);
assert.equal(await page.locator('nav a[href="#direction"]').count(), 0);
await page.locator('.dropdown-toggle').focus();
await page.keyboard.press('ArrowDown');
assert.equal(await page.locator('.dropdown-toggle').getAttribute('aria-expanded'), 'true');
await page.keyboard.press('Escape');
assert.equal(await page.locator('#contributor-menu').isVisible(), false);
await page.locator('.dropdown-toggle').focus();
await page.keyboard.press('Enter');
await page.locator('#contributor-menu a[href="#/contributor"]').click();
await page.getByLabel('Họ và tên', { exact: true }).fill('Nguyễn An');
await page.getByLabel('Email liên hệ', { exact: true }).fill('an@example.com');
await page.getByLabel('Tiêu đề bài viết', { exact: true }).fill('Góc nhìn sinh viên');
await page.getByLabel('Nội dung bài viết', { exact: true }).fill('Nội dung '.repeat(1000));
await page.getByRole('button', { name: 'Mở email để gửi bài' }).click();
assert.match(await page.locator('#form-status').textContent(), /Bài viết dài/);
const downloadReady = page.waitForEvent('download');
await page.getByRole('button', { name: 'Tải nội dung .txt' }).click();
const download = await downloadReady;
assert.equal(download.suggestedFilename(), 'yvoice-bai-viet.txt');
const stream = await download.createReadStream();
const chunks = []; for await (const chunk of stream) chunks.push(chunk);
assert.match(Buffer.concat(chunks).toString('utf8'), /insightyouthvoiceclub@gmail.com/);
assert.match(Buffer.concat(chunks).toString('utf8'), /Nguyễn An/);
await page.screenshot({ path: '../email-desktop.png', fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + '#/contributor');
await page.reload();
assert.equal(await page.locator('#app-page h1').textContent(), 'Gửi bài viết');
assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
await page.locator('[data-menu-toggle]').click();
await page.locator('.dropdown-toggle').focus();
await page.keyboard.press('Enter');
assert.equal(await page.locator('#contributor-menu').isVisible(), true);
await page.screenshot({ path: '../email-mobile-menu.png', fullPage: false });
await page.locator('#contributor-menu a[href="#/writing-guide"]').click();
assert.equal(await page.locator('#app-page h1').textContent(), 'Hướng dẫn viết bài');
assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'), 'false');
await page.goto(base + '#/citations');
assert.equal(await page.locator('#app-page h1').textContent(), 'Cách trích nguồn');
await page.goto(base + '#about');
assert.equal(await page.locator('#home').isVisible(), true);
assert.equal(await page.locator('#about #direction').count(), 1);
assert.equal(await page.locator('#about #leadership').count(), 1);
assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
for (const link of await page.locator('a[href*="facebook.com"]').all()) {
  assert.equal(await link.getAttribute('target'), '_blank');
  assert.equal(await link.getAttribute('rel'), 'noopener noreferrer');
}
assert.deepEqual(errors, []);
await browser.close();
console.log('PASS: desktop/mobile navigation, keyboard, hash refresh, form validation, long article fallback, real TXT download, Facebook links, no page errors.');




