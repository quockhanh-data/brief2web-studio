export const recipient = 'insightyouthvoiceclub@gmail.com';
export const endpoint = `https://formsubmit.co/ajax/${recipient}`;
export async function submitArticle(fields, fetcher = fetch) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetcher(endpoint, {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: '[Y-VOICE] Bài viết mới – ' + fields.title.replace(/[\r\n]/g, ' '),
        _template: 'table', _honey: fields._honey || '',
        name: fields.name, email: fields.email,
        'Họ tên': fields.name, 'Email': fields.email,
        'Số điện thoại': fields.phone || '', 'Tiêu đề': fields.title,
        'Chủ đề': fields.category, 'Nội dung': fields.content,
        'Nguồn tham khảo': fields.references || '',
        'Link tài liệu': fields.document || '',
        'Xác nhận tác giả / nguồn': fields.confirmation === 'on' ? 'Đã xác nhận' : ''
      })
    });
    if (!response.ok) throw new Error('Email service failed');
    const result = await response.json();
    if (/activat|confirm.*email|verify.*email/i.test(String(result.message || ''))) return 'activation';
    if (result.success !== true && result.success !== 'true') throw new Error('Submission not accepted');
    return 'success';
  } finally { clearTimeout(timeout); }
}
