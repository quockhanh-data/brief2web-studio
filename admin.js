const loginPanel = document.querySelector('#login-panel');
const dashboard = document.querySelector('#dashboard');
const loginForm = document.querySelector('#login-form');
const articleForm = document.querySelector('#article-form');
const articleList = document.querySelector('#article-list');
const listMessage = document.querySelector('#list-message');
const editorMessage = document.querySelector('#editor-message');
let currentStatus = 'all';

function message(node, text, kind = '') { node.textContent = text; node.className = `admin-message ${kind}`.trim(); }
async function api(path, options = {}) {
  const response = await fetch(`/api/${path}`, { credentials: 'same-origin', ...options, headers: { ...(options.body ? { 'content-type': 'application/json' } : {}), ...options.headers } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Không thể hoàn tất yêu cầu.');
  return data;
}

function showDashboard() { loginPanel.hidden = true; dashboard.hidden = false; loadArticles(); }
async function checkSession() { try { await api('admin/session'); showDashboard(); } catch { loginPanel.hidden = false; dashboard.hidden = true; } }

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  const button = loginForm.querySelector('button[type="submit"]'); button.disabled = true;
  const password = new FormData(loginForm).get('password');
  try { await api('admin/login', { method: 'POST', body: JSON.stringify({ password }) }); loginForm.reset(); showDashboard(); }
  catch (error) { message(loginForm.querySelector('.admin-message'), error.message, 'error'); }
  finally { button.disabled = false; }
});

document.querySelector('#logout').addEventListener('click', async () => {
  await api('admin/logout', { method: 'POST', body: '{}' }).catch(() => {});
  dashboard.hidden = true; loginPanel.hidden = false;
});

document.querySelector('#refresh').addEventListener('click', loadArticles);
document.querySelectorAll('.admin-filters button').forEach(button => button.addEventListener('click', () => {
  currentStatus = button.dataset.status;
  document.querySelectorAll('.admin-filters button').forEach(item => item.classList.toggle('active', item === button));
  loadArticles();
}));

function clearEditor() {
  articleForm.reset(); articleForm.elements.id.value = '';
  document.querySelector('#editor-title').textContent = 'Viết bài mới';
  document.querySelector('#cancel-edit').hidden = true;
}
document.querySelector('#cancel-edit').addEventListener('click', clearEditor);

articleForm.addEventListener('submit', async event => {
  event.preventDefault();
  const intent = event.submitter?.value || 'draft';
  const id = articleForm.elements.id.value;
  const payload = Object.fromEntries(new FormData(articleForm));
  payload.content = payload.content.trim(); payload.status = intent;
  const submitter = event.submitter; submitter.disabled = true;
  try {
    if (id) {
      await api(`admin/articles/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) });
    } else await api('admin/articles', { method: 'POST', body: JSON.stringify(payload) });
    message(editorMessage, intent === 'published' ? 'Bài đã được đăng.' : 'Đã lưu bản nháp.', 'success');
    clearEditor(); await loadArticles();
  } catch (error) { message(editorMessage, error.message, 'error'); }
  finally { submitter.disabled = false; }
});

function editArticle(article) {
  articleForm.elements.id.value = article.id;
  articleForm.elements.title.value = article.title;
  articleForm.elements.category.value = article.category;
  articleForm.elements.excerpt.value = article.excerpt || '';
  articleForm.elements.content.value = article.body || '';
  articleForm.elements.image.value = article.cover_image || '';
  document.querySelector('#editor-title').textContent = 'Sửa bài viết';
  document.querySelector('#cancel-edit').hidden = false;
  articleForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function updateStatus(id, status) {
  try { await api(`admin/articles/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ status }) }); await loadArticles(); }
  catch (error) { message(listMessage, error.message, 'error'); }
}

function makeArticleCard(article) {
  const card = document.createElement('article'); card.className = 'managed-article';
  const title = document.createElement('h3'); title.textContent = article.title;
  const detail = document.createElement('p'); detail.textContent = `${article.category} · ${article.status} · ${new Date(article.created_at).toLocaleDateString('vi-VN')}`;
  card.append(title, detail);
  if (article.author_name) { const author = document.createElement('p'); author.textContent = `Tác giả gửi: ${article.author_name} (${article.author_email})`; card.append(author); }
  const actions = document.createElement('div'); actions.className = 'article-actions';
  const edit = document.createElement('button'); edit.textContent = 'Sửa'; edit.addEventListener('click', () => editArticle(article)); actions.append(edit);
  if (article.status !== 'published') { const publish = document.createElement('button'); publish.textContent = 'Duyệt và đăng'; publish.className = 'publish'; publish.addEventListener('click', () => updateStatus(article.id, 'published')); actions.append(publish); }
  if (article.status === 'published') { const unpublish = document.createElement('button'); unpublish.textContent = 'Gỡ khỏi bảng tin'; unpublish.addEventListener('click', () => updateStatus(article.id, 'draft')); actions.append(unpublish); }
  if (article.status === 'pending') { const draft = document.createElement('button'); draft.textContent = 'Chuyển thành nháp'; draft.addEventListener('click', () => updateStatus(article.id, 'draft')); actions.append(draft); }
  if (article.status !== 'archived') { const archive = document.createElement('button'); archive.textContent = 'Ẩn bài'; archive.addEventListener('click', () => updateStatus(article.id, 'archived')); actions.append(archive); }
  if (article.status === 'archived') { const restore = document.createElement('button'); restore.textContent = 'Khôi phục nháp'; restore.addEventListener('click', () => updateStatus(article.id, 'draft')); actions.append(restore); }
  card.append(actions); return card;
}

async function loadArticles() {
  message(listMessage, 'Đang tải bài viết…'); articleList.replaceChildren();
  try {
    const data = await api(`admin/articles?status=${encodeURIComponent(currentStatus)}`);
    if (!data.articles.length) { const empty = document.createElement('p'); empty.className = 'empty-state'; empty.textContent = 'Chưa có bài viết ở mục này.'; articleList.append(empty); message(listMessage, ''); return; }
    articleList.append(...data.articles.map(makeArticleCard)); message(listMessage, `${data.articles.length} bài viết`);
  } catch (error) { message(listMessage, error.message, 'error'); }
}

checkSession();
