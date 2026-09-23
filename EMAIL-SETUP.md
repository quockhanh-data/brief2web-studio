# Gửi bài Y-VOICE qua email

Người nhận: insightyouthvoiceclub@gmail.com.

Không cần Supabase, tài khoản, API key hay backend. Nút mở email điền sẵn tiêu đề/nội dung qua mailto. Người dùng phải bấm Gửi trong ứng dụng email. Website không thể xác nhận thư được gửi hoặc CLB đã nhận.

Bài dài có thể vượt giới hạn mailto của trình duyệt/ứng dụng. Form cung cấp sao chép nội dung và tải .txt; người dùng gửi email thủ công hoặc chia sẻ link tài liệu. Word/PDF được đính kèm trong ứng dụng email. Form không lưu dữ liệu khi reload/rời trang.

## Các trang

- `#/contributor`: form gửi bài.
- `#/writing-guide`: gợi ý viết bài, chưa phải quy định chính thức.
- `#/citations`: ví dụ trích dẫn tham khảo.

Không có đăng nhập hoặc database. Bài gửi không tự đăng lên bảng tin; CLB tiếp nhận, duyệt và đăng riêng.

## Kiểm tra và xuất bản

Chạy `npm install`, `npm test`, `npm run build`. Không có lint được cấu hình trước đó.

Các file HTML/CSS/JS gốc vẫn chạy trực tiếp trên GitHub Pages, không bắt buộc Actions. Giữ Pages ở branch `yvoice-insight-hub`, thư mục `/ (root)`. Commit/push mã nguồn vào đúng branch này. Nếu dùng hosting khác, có thể dùng thư mục `dist` được tạo bởi Vite.

Không dùng nội dung thư hoặc tên tác giả làm HTML. mailto mã hóa riêng subject/body để bảo toàn dấu tiếng Việt và ký tự đặc biệt.

## Còn cần nội dung từ CLB

Tên, ảnh, tiểu sử Chủ nhiệm/Phó Chủ nhiệm và hướng dẫn viết/trích nguồn chính thức. TODO được đặt trong source; chưa tự điền thông tin không xác thực.
