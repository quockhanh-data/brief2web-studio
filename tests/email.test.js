import test from 'node:test';
import assert from 'node:assert/strict';
import { composeArticle, recipient } from '../email.js';
const input = { title: 'Góc nhìn & câu hỏi?', author: 'Nguyễn An', email: 'an@example.com', content: 'Nội dung tiếng Việt\nDòng hai #1', category: 'Tập san', reference: 'https://example.com/?a=1&b=2' };
test('email recipient and Vietnamese content survive URL encoding', () => {
  const result = composeArticle(input);
  const url = new URL(result.mailto);
  assert.equal(url.pathname, recipient);
  assert.equal(url.searchParams.get('subject'), result.subject);
  assert.equal(url.searchParams.get('body'), result.body);
  assert.ok(result.body.includes(input.content));
  assert.equal(url.searchParams.size, 2);
});
test('reject empty required fields and invalid email', () => {
  for (const field of ['title', 'author', 'content', 'email']) assert.throws(() => composeArticle({ ...input, [field]: ' ' }));
  assert.throws(() => composeArticle({ ...input, email: 'abc' }));
});
test('reject active or malformed document links', () => {
  for (const reference of ['javascript:alert(1)', 'data:text/plain,abc', 'not a link']) assert.throws(() => composeArticle({ ...input, reference }));
  assert.ok(composeArticle({ ...input, reference: '' }));
});
