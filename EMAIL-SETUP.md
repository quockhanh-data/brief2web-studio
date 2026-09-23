# Y-VOICE — FormSubmit

Form gửi JSON bằng POST đến https://formsubmit.co/ajax/insightyouthvoiceclub@gmail.com. Không cần tài khoản, database, khóa API hoặc backend. Chỉ hiển thị thành công khi HTTP thành công và dịch vụ trả success=true. Lỗi mạng, HTTP, JSON hoặc success=false hiển thị lỗi, giữ nội dung để thử lại. Phản hồi yêu cầu kích hoạt không hiển thị thành công.

Không upload file: dùng link tài liệu Google Drive/Word/PDF, hoặc gửi file bằng email trực tiếp. Form có honeypot, kiểm tra bắt buộc, email, link và checkbox; chống gửi lặp khi request đang chạy. Honeypot không thay thế hệ thống chống spam của nhà cung cấp.

## Kích hoạt lần đầu
1. Đưa mã lên nhánh yvoice-insight-hub, GitHub Pages /root.
2. Gửi một bài kiểm tra từ website công khai.
3. Mở insightyouthvoiceclub@gmail.com (cả Spam), xác nhận email Activate Form từ FormSubmit. Không chia sẻ link kích hoạt công khai.
4. Gửi lại một bài kiểm tra và xác nhận email đến, tiêu đề, nội dung và link tài liệu đúng. Chưa thể xác nhận nhận email nếu chưa hoàn thành bước này.

Phản hồi success của dịch vụ xác nhận dịch vụ chấp nhận request; không chứng minh email đã đến Inbox. Nếu cần chẩn đoán, kiểm tra Spam và trạng thái dịch vụ. Tài liệu nhà cung cấp: https://formsubmit.co/ajax-documentation và https://formsubmit.co/.

## Kiểm tra
npm install
npm test
npm run build
node tests/browser-check.mjs

Browser tests chặn/mô phỏng phản hồi nhà cung cấp, không gửi thư thử. Chưa kiểm tra nhận thư thực tế vì cần người quản lý hộp thư kích hoạt và xác nhận. Không có lint trong dự án.
