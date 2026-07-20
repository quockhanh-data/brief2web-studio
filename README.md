# Brief2Web Studio

Repo tổng cho các website tĩnh đặt theo yêu cầu.

## Tên dự án

`brief2web-studio`

Ý nghĩa: nhận brief, dựng thành web có thể review, deploy và bàn giao nhanh.

## Cách tổ chức branch

| Branch | Vai trò |
| --- | --- |
| `main` | Trang tổng giới thiệu dịch vụ/order web |
| `yvoice-insight-hub` | Website CLB Y-VOICE |

Mỗi đơn mới nên tạo một branch riêng:

```bash
git switch main
git switch -c client-ten-du-an
```

## Chạy thử

```bash
python -m http.server 4173
```

Mở `http://127.0.0.1:4173`.

## Đẩy lên GitHub

Tạo repo GitHub tên `brief2web-studio`, rồi chạy:

```bash
git remote add origin https://github.com/<username>/brief2web-studio.git
git push -u origin main
git push -u origin yvoice-insight-hub
```

## GitHub Pages

- Muốn hiện trang tổng: chọn branch `main`, folder `/root`.
- Muốn cho CLB Y-VOICE xem: chọn branch `yvoice-insight-hub`, folder `/root`.
- Khi khách chốt bản web, có thể tách branch đó thành repo riêng hoặc đổi Pages sang branch đó.

## Checklist nhận đơn

1. Logo, màu chủ đạo, ảnh bìa.
2. Nội dung giới thiệu, dịch vụ/hoạt động, liên hệ.
3. Web tham khảo.
4. Đối tượng người xem.
5. Domain/hosting dự kiến.
