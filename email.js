export const recipient = 'insightyouthvoiceclub@gmail.com';

export function composeArticle(fields) {
  const read = (key) => String(fields[key] || '').trim();
  const title = read('title');
  const name = read('author');
  const email = read('email');
  const content = read('content');
  if (!title || !name || !content || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Vui lòng nhập tiêu đề, họ tên, email hợp lệ và nội dung bài.');
  }
  const reference = read('reference');
  if (reference) {
    let url;
    try { url = new URL(reference); } catch { throw new Error('Link tài liệu chưa hợp lệ.'); }
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Link tài liệu cần bắt đầu bằng https:// hoặc http://.');
  }
  const subject = `[Y-VOICE • Gửi bài] ${title.replace(/[\r\n]+/g, ' ')}`;
  const body = [
    'Chào Ban biên tập Y-VOICE,', '',
    `Họ tên tác giả: ${name}`, `Email liên hệ: ${email}`,
    `Chủ đề: ${read('category')}`, `Tiêu đề: ${title}`, '',
    'NỘI DUNG BÀI VIẾT', content, '',
    `Nguồn tham khảo / link tài liệu: ${reference || 'Không cung cấp'}`, '',
    'Cảm ơn Ban biên tập.'
  ].join('\r\n');
  return { subject, body, mailto: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
