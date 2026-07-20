# Brief2Web Studio

Dự án tổng cho các website tĩnh đặt theo yêu cầu.

## Cách tổ chức repo

- `main`: trang tổng Brief2Web Studio.
- `yvoice-insight-hub`: website Y-VOICE | Tiếng nói lý luận trẻ.

Mỗi đơn web mới có thể tạo một branch riêng:

```bash
git switch main
git switch -c ten-du-an-moi
```

## Chạy thử

```bash
python -m http.server 4173
```

Mở `http://127.0.0.1:4173`.

## Deploy

GitHub Pages có thể deploy `main` làm trang tổng. Nếu muốn cho khách xem một web riêng, đổi branch Pages sang branch của dự án đó hoặc tách branch thành repo riêng.

Tên repo gợi ý: `brief2web-studio`.
