const COOKIE = "yv_admin";
const CATEGORIES = new Set(["Tập san", "Podcast", "Bài báo khoa học", "Nghiên cứu", "Chia sẻ", "Khác"]);
class ApiInputError extends Error {}

const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
});

function cookieValue(request, name) {
  const part = (request.headers.get("cookie") || "").split(";").map(x => x.trim()).find(x => x.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.slice(name.length + 1)) : "";
}

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlToBytes(value) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}

async function digest(value) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

function createSessionToken() {
  return bytesToBase64Url(crypto.getRandomValues(new Uint8Array(32)));
}

async function tokenHash(token) {
  return bytesToBase64Url(await digest(token));
}

async function hasSession(request, env) {
  const token = cookieValue(request, COOKIE);
  if (!token || token.length > 128) return false;
  const session = await env.DB.prepare("SELECT expires_at FROM admin_sessions WHERE token_hash=?").bind(await tokenHash(token)).first();
  return Boolean(session && Number(session.expires_at) > Math.floor(Date.now() / 1000));
}

function sameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).host === new URL(request.url).host; } catch { return false; }
}

async function readBody(request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 60000) throw new ApiInputError("Bài gửi vượt quá dung lượng cho phép.");
  const value = await request.json();
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ApiInputError("Dữ liệu không hợp lệ.");
  return value;
}

function validateArticle(value) {
  const title = String(value.title || "").trim();
  const category = String(value.category || "").trim();
  const body = String(value.content || value.body || "").trim();
  const excerpt = String(value.excerpt || body.slice(0, 240)).trim();
  const image = String(value.image || value.cover_image || "").trim();
  if (!title || title.length > 200) throw new ApiInputError("Tiêu đề cần có và tối đa 200 ký tự.");
  if (!CATEGORIES.has(category)) throw new ApiInputError("Vui lòng chọn chuyên mục hợp lệ.");
  if (!body || body.length > 50000) throw new ApiInputError("Nội dung cần có và tối đa 50.000 ký tự.");
  if (excerpt.length > 500) throw new ApiInputError("Mô tả ngắn tối đa 500 ký tự.");
  if (image && (!/^https:\/\//i.test(image) || image.length > 2048)) throw new ApiInputError("Ảnh bìa cần là đường dẫn HTTPS hợp lệ.");
  return { title, category, body, excerpt, image };
}

async function requireAdmin(request, env) {
  return Boolean(env.ADMIN_PASSWORD && await hasSession(request, env));
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const method = request.method.toUpperCase();
  if (!env.DB) return json({ error: "Kho bài viết chưa được cấu hình. Ban quản trị cần nối D1 với binding DB." }, 503);
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && !sameOrigin(request)) return json({ error: "Nguồn gửi không hợp lệ." }, 403);

  try {
    if (path === "/api/posts" && method === "GET") {
      const { results } = await env.DB.prepare("SELECT id, title, category, excerpt, body, cover_image, published_at FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT 100").all();
      return json({ posts: results || [] }, 200, { "cache-control": "public, max-age=60, s-maxage=60" });
    }

    if (path === "/api/admin/login" && method === "POST") {
      if (!sameOrigin(request)) return json({ error: "Nguồn gửi không hợp lệ." }, 403);
      if (!env.ADMIN_PASSWORD) return json({ error: "Quản trị viên cần cấu hình ADMIN_PASSWORD trong Cloudflare." }, 503);
      const value = await readBody(request);
      const supplied = String(value.password || "");
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const throttleKey = bytesToBase64Url(await digest(ip));
      const nowSeconds = Math.floor(Date.now() / 1000);
      const attempts = await env.DB.prepare("SELECT attempts, window_started FROM admin_login_attempts WHERE ip_hash=?").bind(throttleKey).first();
      if (attempts && nowSeconds - attempts.window_started < 900 && attempts.attempts >= 8) return json({ error: "Bạn đã thử nhiều lần. Vui lòng chờ 15 phút rồi thử lại." }, 429);
      if (!attempts || nowSeconds - attempts.window_started >= 900) {
        await env.DB.prepare("INSERT INTO admin_login_attempts (ip_hash, attempts, window_started) VALUES (?,0,?) ON CONFLICT(ip_hash) DO UPDATE SET attempts=0, window_started=excluded.window_started").bind(throttleKey, nowSeconds).run();
      }
      const candidate = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(supplied));
      const expected = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(env.ADMIN_PASSWORD));
      const candidateBytes = new Uint8Array(candidate), expectedBytes = new Uint8Array(expected);
      let mismatch = candidateBytes.length ^ expectedBytes.length;
      for (let i = 0; i < Math.max(candidateBytes.length, expectedBytes.length); i++) mismatch |= (candidateBytes[i] || 0) ^ (expectedBytes[i] || 0);
      if (supplied.length < 1 || supplied.length > 256 || mismatch !== 0) {
        await env.DB.prepare("UPDATE admin_login_attempts SET attempts=attempts+1 WHERE ip_hash=?").bind(throttleKey).run();
        return json({ error: "Mật khẩu chưa đúng." }, 401);
      }
      await env.DB.prepare("DELETE FROM admin_login_attempts WHERE ip_hash=?").bind(throttleKey).run();
      const token = createSessionToken();
      const expiresAt = nowSeconds + 60 * 60 * 12;
      const tokenDigest = await tokenHash(token);
      await env.DB.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?").bind(nowSeconds).run();
      await env.DB.prepare("INSERT INTO admin_sessions (token_hash, expires_at) VALUES (?, ?)").bind(tokenDigest, expiresAt).run();
      return json({ ok: true }, 200, { "set-cookie": `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200` });
    }

    if (path === "/api/admin/logout" && method === "POST") {
      const token = cookieValue(request, COOKIE);
      if (token) await env.DB.prepare("DELETE FROM admin_sessions WHERE token_hash=?").bind(await tokenHash(token)).run();
      return json({ ok: true }, 200, { "set-cookie": `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` });
    }

    if (!path.startsWith("/api/admin/")) return json({ error: "Không tìm thấy API." }, 404);
    if (!await requireAdmin(request, env)) return json({ error: "Vui lòng đăng nhập lại." }, 401);

    if (path === "/api/admin/session" && method === "GET") return json({ ok: true });

    if (path === "/api/admin/articles" && method === "GET") {
      const status = url.searchParams.get("status") || "all";
      const query = status === "all"
        ? "SELECT id,title,category,excerpt,body,cover_image,references_text,document_url,status,created_at,updated_at,published_at FROM articles ORDER BY created_at DESC LIMIT 200"
        : "SELECT id,title,category,excerpt,body,cover_image,references_text,document_url,status,created_at,updated_at,published_at FROM articles WHERE status = ? ORDER BY created_at DESC LIMIT 200";
      const result = status === "all" ? await env.DB.prepare(query).all() : await env.DB.prepare(query).bind(status).all();
      return json({ articles: result.results || [] });
    }

    if (path === "/api/admin/articles" && method === "POST") {
      const value = await readBody(request);
      const article = validateArticle(value);
      const status = ["draft", "published"].includes(value.status) ? value.status : "draft";
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await env.DB.prepare("INSERT INTO articles (id,title,category,excerpt,body,cover_image,status,created_at,updated_at,published_at) VALUES (?,?,?,?,?,?,?,?,?,?)")
        .bind(id, article.title, article.category, article.excerpt, article.body, article.image, status, now, now, status === "published" ? now : null).run();
      return json({ ok: true, id }, 201);
    }

    const match = path.match(/^\/api\/admin\/articles\/([\w-]+)$/);
    if (match && method === "PATCH") {
      const id = match[1];
      const value = await readBody(request);
      if (value.title !== undefined) {
        const article = validateArticle(value);
        const status = ["draft", "published", "archived"].includes(value.status) ? value.status : "draft";
        const now = new Date().toISOString();
        await env.DB.prepare("UPDATE articles SET title=?,category=?,excerpt=?,body=?,cover_image=?,status=?,updated_at=?,published_at=CASE WHEN ?='published' THEN COALESCE(published_at, ?) WHEN ?!='published' THEN NULL ELSE published_at END WHERE id=?")
          .bind(article.title, article.category, article.excerpt, article.body, article.image, status, now, status, now, status, id).run();
      } else if (value.status && ["draft", "published", "archived"].includes(value.status)) {
        const now = new Date().toISOString();
        await env.DB.prepare("UPDATE articles SET status=?, updated_at=?, published_at=CASE WHEN ?='published' THEN COALESCE(published_at, ?) WHEN ?!='published' THEN NULL ELSE published_at END WHERE id=?")
          .bind(value.status, now, value.status, now, value.status, id).run();
      } else {
        const article = validateArticle(value);
        const now = new Date().toISOString();
        await env.DB.prepare("UPDATE articles SET title=?,category=?,excerpt=?,body=?,cover_image=?,updated_at=? WHERE id=?")
          .bind(article.title, article.category, article.excerpt, article.body, article.image, now, id).run();
      }
      return json({ ok: true });
    }

    return json({ error: "Không tìm thấy API quản trị." }, 404);
  } catch (error) {
    if (error instanceof SyntaxError) return json({ error: "Dữ liệu gửi lên không đúng định dạng." }, 400);
    if (error instanceof ApiInputError) return json({ error: error.message }, 400);
    return json({ error: "Không thể xử lý yêu cầu lúc này." }, 500);
  }
}
