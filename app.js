import { composeArticle, recipient } from './email.js';

const home = document.querySelector('#home');
const page = document.querySelector('#app-page');
const pages = {
  '/contributor': {
    title: 'Gửi bài viết',
    content: `<p class="page-intro">Chia sẻ góc nhìn của bạn với Y-VOICE. Bài viết được gửi tới <a href="mailto:${recipient}">${recipient}</a> qua email, không cần tài khoản.</p>
    <div class="notice"><strong>Gửi bằng ứng dụng email của bạn</strong><p>Điền bài viết, sau đó mở email và bấm Gửi trong ứng dụng email. Website không tự gửi hay xác nhận đã nhận bài.</p></div>
    <form id="article-form" class="article-form">
      <div class="form-row"><label>Họ và tên<input name="author" autocomplete="name" required maxlength="120"></label><label>Email liên hệ<input name="email" type="email" autocomplete="email" required maxlength="254"></label></div>
      <label>Tiêu đề bài viết<input name="title" required maxlength="200"></label>
      <label>Chủ đề<select name="category"><option>Tập san</option><option>Podcast</option><option>Sự kiện</option><option>Kỹ năng</option><option>Khác</option></select></label>
      <label>Nội dung bài viết<textarea name="content" rows="12" required maxlength="100000" aria-describedby="content-help"></textarea></label>
      <p id="content-help" class="field-help">Bài dài: nên đặt trong Google Docs hoặc tài liệu chia sẻ, rồi điền phần tóm tắt ở đây. Bạn có thể đính kèm Word/PDF trong ứng dụng email.</p>
      <label>Link nguồn tham khảo / tài liệu (không bắt buộc)<input name="reference" type="url" placeholder="https://…" maxlength="2048"></label>
      <div class="form-actions"><button class="button primary" type="submit">Mở email để gửi bài</button><button class="button secondary" type="button" id="copy-article">Sao chép nội dung email</button><button class="button secondary" type="button" id="download-article">Tải nội dung .txt</button></div>
      <p id="form-status" role="status" aria-live="polite"></p>
    </form>
    <div class="notice"><strong>Nếu email không mở</strong><p>Sao chép nội dung hoặc tải file .txt, rồi soạn thư mới gửi tới <a href="mailto:${recipient}">${recipient}</a>. Kiểm tra địa chỉ người nhận và tệp đính kèm trước khi gửi. Nội dung form không được lưu sau khi tải lại hoặc rời trang.</p></div>`
  },
  '/writing-guide': {
    title: 'Hướng dẫn viết bài',
    content: `<p class="page-intro">Gợi ý chuẩn bị bản thảo gửi Y-VOICE.</p><div class="notice">Các gợi ý dưới đây chỉ để tham khảo. Hướng dẫn chính thức của CLB đang được cập nhật.</div>
      <!-- TODO: Replace suggestions with guidelines approved by Y-VOICE. -->
      <div class="guide-content"><h2>Yêu cầu chung</h2><p>Chọn vấn đề cụ thể, nêu rõ góc nhìn và kiểm tra độ tin cậy của thông tin. Phân biệt dữ kiện với ý kiến cá nhân.</p>
      <h2>Cấu trúc bài viết</h2><p>Có thể bắt đầu bằng câu hỏi chính, triển khai luận điểm cùng dẫn chứng, rồi kết lại bằng nhận định của tác giả.</p>
      <h2>Cách trình bày</h2><p>Chia đoạn dễ đọc, dùng tiêu đề ngắn và ghi nguồn cho nội dung trích dẫn. Nếu có hình ảnh, ghi tác giả hoặc nguồn ảnh.</p>
      <h2>Checklist trước khi gửi</h2><ul><li>Tiêu đề phản ánh đúng nội dung.</li><li>Kiểm tra chính tả, số liệu và trích dẫn.</li><li>Điền tên tác giả và email liên hệ.</li><li>Kiểm tra quyền xem đối với link tài liệu chia sẻ.</li></ul>
      <a class="button primary" href="#/contributor">Gửi bài viết</a></div>`
  },
  '/citations': {
    title: 'Cách trích nguồn',
    content: `<p class="page-intro">Để người đọc có thể tìm lại và kiểm chứng thông tin bạn sử dụng.</p><div class="notice">Ví dụ tham khảo, không phải quy chuẩn trích dẫn chính thức của CLB. Chưa có quy định xác nhận về APA hoặc MLA.</div>
      <!-- TODO: Add the club's approved citation requirements. -->
      <div class="guide-content"><h2>Website</h2><p>Tác giả hoặc tổ chức. “Tên trang/bài viết”. Ngày đăng (nếu có). URL và ngày truy cập.</p>
      <h2>Báo</h2><p>Tác giả. “Tiêu đề bài báo”. Tên báo, ngày đăng, URL.</p>
      <h2>Sách</h2><p>Tác giả. Tên sách. Nhà xuất bản, năm xuất bản, số trang được trích.</p>
      <h2>Báo cáo / nghiên cứu</h2><p>Tác giả hoặc tổ chức. Tên báo cáo hoặc nghiên cứu. Năm công bố, đơn vị xuất bản hoặc tên tạp chí, DOI/URL nếu có.</p>
      <p>Đặt phần trích nguyên văn trong dấu ngoặc kép. Khi diễn giải bằng lời của mình, vẫn ghi nguồn ý tưởng hoặc số liệu.</p><a class="button primary" href="#/contributor">Gửi bài viết</a></div>`
  }
};

function wireForm() {
  const form = document.querySelector('#article-form');
  if (!form) return;
  const status = document.querySelector('#form-status');
  function article() {
    if (!form.reportValidity()) return null;
    try { return composeArticle(Object.fromEntries(new FormData(form))); }
    catch (error) { status.textContent = error.message; return null; }
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = article();
    if (!data) return;
    // Long mailto URLs are not reliably supported by email clients.
    if (data.mailto.length > 1800) {
      status.textContent = 'Bài viết dài hơn mức mở email ổn định. Hãy dùng “Sao chép nội dung email” hoặc “Tải nội dung .txt”, rồi gửi đến ' + recipient + '.';
      return;
    }
    status.textContent = 'Đã yêu cầu mở ứng dụng email. Bài chưa được gửi: hãy kiểm tra nội dung và bấm Gửi trong email. Nếu không mở được, dùng nút sao chép hoặc tải file.';
    window.location.href = data.mailto;
  });
  document.querySelector('#copy-article').addEventListener('click', async () => {
    const data = article();
    if (!data) return;
    try {
      await navigator.clipboard.writeText(`Người nhận: ${recipient}\r\nTiêu đề: ${data.subject}\r\n\r\n${data.body}`);
      status.textContent = 'Đã sao chép. Hãy dán vào email và gửi tới ' + recipient + '. Bài chưa được gửi.';
    } catch {
      status.textContent = 'Trình duyệt không cho phép sao chép. Hãy dùng “Tải nội dung .txt”.';
    }
  });
  document.querySelector('#download-article').addEventListener('click', () => {
    const data = article();
    if (!data) return;
    const blob = new Blob(['\uFEFF', `Người nhận: ${recipient}\r\nTiêu đề: ${data.subject}\r\n\r\n${data.body}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'yvoice-bai-viet.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Đã tạo file nội dung để tải xuống. Hãy đính kèm hoặc sao chép nội dung vào email. Bài chưa được gửi.';
  });
}

function route() {
  const path = location.hash.slice(1);
  const active = path.startsWith('/');
  home.hidden = active; page.hidden = !active;
  document.body.classList.toggle('interior-page', active);
  if (!active) {
    document.title = 'Y-VOICE | Tiếng nói lý luận trẻ';
    requestAnimationFrame(() => document.getElementById(path || 'home')?.scrollIntoView());
    return;
  }
  const entry = pages[path] || { title: 'Không tìm thấy trang', content: '<p>Trang này không tồn tại. <a href="#home">Về trang chủ</a></p>' };
  document.title = entry.title + ' | Y-VOICE';
  page.innerHTML = `<div class="container contributor-container"><a class="back-link" href="#home">← Về Y-VOICE</a><p class="section-kicker">Cộng Tác Viên</p><h1>${entry.title}</h1>${entry.content}</div>`;
  window.scrollTo(0, 0); page.focus({ preventScroll: true }); wireForm();
}
addEventListener('hashchange', route);
route();
