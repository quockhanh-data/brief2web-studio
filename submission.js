export const recipient = 'insightyouthvoiceclub@gmail.com';
const endpoint = `https://formsubmit.co/ajax/${recipient}`;

export async function submitArticle(fields, fetcher = fetch) {
  const payload = Object.fromEntries(Object.entries(fields).filter(([key]) => !['confirmation', '_honey'].includes(key)));
  payload._subject = `[Y-VOICE] Bài gửi mới: ${String(payload.title || '').slice(0, 120)}`;
  payload._template = 'table';
  payload._captcha = 'true';

  const response = await fetcher(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !(result.success === true || result.success === 'true')) {
    throw new Error(result.message || 'Không gửi được bài viết.');
  }
  return 'success';
}