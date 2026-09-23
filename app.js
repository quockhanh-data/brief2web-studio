import { recipient, submitArticle } from './submission.js';

const home = document.querySelector('#home');
const page = document.querySelector('#app-page');
const pages = {
  '/contributor': {
    title: 'Gửi bài viết',
    content: `<p class="page-intro">Chia sẻ góc nhìn của bạn với Y-VOICE. Không cần tài khoản.</p>
    <form id="article-form" class="article-form" action="https://formsubmit.co/ajax/insightyouthvoiceclub@gmail.com" method="POST" novalidate>
      <div class="form-row"><label>Họ và tên *<input name="name" autocomplete="name" required maxlength="120"></label><label>Email liên hệ *<input name="email" type="email" autocomplete="email" required maxlength="254"></label></div>
      <label>Số điện thoại<input name="phone" type="tel" autocomplete="tel" maxlength="30"></label>
      <label>Tiêu đề bài viết *<input name="title" required maxlength="200"></label>
      <label>Chủ đề / Chuyên mục *<select name="category" required><option value="">Chọn chuyên mục</option><option>Tập san</option><option>Podcast</option><option>Sự kiện</option><option>Kỹ năng</option><option>Khác</option></select></label>
      <label>Nội dung / Mô tả bài viết *<textarea name="content" rows="12" required maxlength="50000"></textarea></label>
      <label>Nguồn tham khảo<textarea name="references" rows="3" maxlength="5000"></textarea></label>
      <label>Link tài liệu Google Drive / Word / PDF<input name="document" type="url" placeholder="https://…" maxlength="2048"></label>
      <p class="field-help">Thay cho đính kèm file, hãy dán link tài liệu và cấp quyền xem cho Ban Biên tập. Bạn cũng có thể gửi file trực tiếp qua email CLB.</p>
      <label class="consent"><input type="checkbox" name="confirmation" required> <span>Tôi xác nhận nội dung gửi là do mình thực hiện hoặc đã ghi nguồn đầy đủ.</span></label>
      <div class="honeypot" aria-hidden="true"><label>Leave blank<input name="_honey" tabindex="-1" autocomplete="off"></label></div>
      <button class="button primary" type="submit">Gửi bài viết</button>
      <p class="field-help">Bài viết sẽ được gửi đến Ban Biên tập Y-VOICE để xem xét trước khi đăng tải.</p>
      <p class="field-help">Thông tin trong form được chuyển qua FormSubmit để gửi email. Nội dung chưa gửi sẽ không được lưu khi rời trang.</p>
      <div id="form-status" role="status" aria-live="polite" tabindex="-1"></div>
    </form>
    <aside class="notice"><strong>Cần hỗ trợ?</strong><p><a href="mailto:insightyouthvoiceclub@gmail.com">insightyouthvoiceclub@gmail.com</a></p><a class="button secondary" href="mailto:insightyouthvoiceclub@gmail.com">Gửi email trực tiếp</a></aside>`
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
  const status = form.querySelector('#form-status');
  const button = form.querySelector('[type="submit"]');
  const fields = [...form.querySelectorAll('input:not([name="_honey"]), select, textarea')];
  for (const field of fields) {
    const error = document.createElement('span');
    error.id = 'error-' + field.name; error.className = 'field-error';
    field.setAttribute('aria-describedby', error.id);
    field.closest('label').after(error);
    field.addEventListener('input', () => validate(field));
    field.addEventListener('change', () => validate(field));
  }
  function validate(field) {
    let message = '';
    if (field.required && (field.type === 'checkbox' ? !field.checked : !field.value.trim())) message = field.type === 'checkbox' ? 'Vui lòng xác nhận nội dung trước khi gửi.' : 'Vui lòng điền trường này.';
    else if (field.validity.typeMismatch) message = field.type === 'email' ? 'Vui lòng nhập email hợp lệ.' : 'Vui lòng nhập link hợp lệ.';
    else if (field.name === 'document' && field.value && !/^https?:\/\//i.test(field.value)) message = 'Link tài liệu cần bắt đầu bằng https:// hoặc http://.';
    else if (!field.validity.valid) message = 'Vui lòng kiểm tra lại nội dung trường này.';
    document.getElementById('error-' + field.name).textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  }
  let sending = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    const invalid = fields.filter(field => !validate(field));
    if (invalid.length) { invalid[0].focus(); return; }
    if (form.elements._honey.value) return;
    sending = true; button.disabled = true; button.textContent = 'Đang gửi…';
    status.textContent = 'Đang chuyển bài viết. Vui lòng chờ.';
    try {
      const result = await submitArticle(Object.fromEntries(new FormData(form)));
      if (result === 'activation') {
        status.textContent = 'Hộp thư nhận bài cần được kích hoạt. Ban Biên tập vui lòng kiểm tra email xác nhận FormSubmit. Bài chưa được xác nhận gửi; bạn có thể gửi trực tiếp qua email bên dưới.';
      } else {
        status.textContent = 'Gửi bài thành công! Cảm ơn bạn đã gửi bài đến Y-VOICE. Ban Biên tập sẽ xem xét nội dung và liên hệ với bạn khi cần.';
        form.reset();
      }
    } catch {
      status.replaceChildren(document.createTextNode('Không thể gửi bài lúc này. Vui lòng thử lại hoặc gửi trực tiếp qua email: '));
      const link = document.createElement('a'); link.href = 'mailto:' + recipient; link.textContent = recipient; status.append(link);
    } finally {
      sending = false; button.disabled = false; button.textContent = 'Gửi bài viết'; status.focus();
    }
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
