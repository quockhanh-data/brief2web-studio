import test from 'node:test';
import assert from 'node:assert/strict';
import { submitArticle, endpoint } from '../submission.js';
const fields = { name: 'Kiểm thử', email: 'test@example.com', title: 'Bài thử', content: 'Nội dung', category: 'Khác', confirmation: 'on' };
test('POST readable payload and accept explicit success only', async () => {
  const result = await submitArticle(fields, async (url, options) => {
    assert.equal(url, endpoint); assert.equal(options.method, 'POST');
    const body = JSON.parse(options.body);
    assert.equal(body['Nội dung'], fields.content); assert.equal(body._honey, '');
    assert.equal(body._subject, '[Y-VOICE] Bài viết mới – Bài thử');
    return { ok: true, json: async () => ({ success: 'true' }) };
  });
  assert.equal(result, 'success');
});
test('HTTP errors, negative responses, malformed JSON and network failure never succeed', async () => {
  for (const response of [{ ok: false }, { ok: true, json: async () => ({ success: false }) }, { ok: true, json: async () => ({}) }, { ok: true, json: async () => { throw Error('invalid'); } }]) {
    await assert.rejects(submitArticle(fields, async () => response));
  }
  await assert.rejects(submitArticle(fields, async () => { throw Error('offline'); }));
});
test('activation response does not claim delivered', async () => {
  assert.equal(await submitArticle(fields, async () => ({ ok: true, json: async () => ({ success: true, message: 'Please activate your form' }) })), 'activation');
});
