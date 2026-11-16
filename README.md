# Kho thiết bị CLB

Ứng dụng tiếng Việt để thành viên đăng ký và người phụ trách quản lý việc mượn thiết bị. Dữ liệu được lưu bền vững bằng SQLite và tự nạp mẫu lần đầu.

## Chạy nhanh

Yêu cầu Node 20.11+. Chạy `npm install`, rồi `npm run demo` và mở http://localhost:3000.

Phát triển: chỉ cần chạy `npm run dev`, rồi mở `http://localhost:5173`. API phát triển dùng cổng `3001` để không xung đột với cổng demo `3000`; Vite đã tự proxy mọi đường dẫn `/api` sang API này. Kiểm thử: `npm run verify`. Có thể nạp lại dữ liệu mẫu ngay trong header hoặc bằng `npm run seed`.

`SUBMIT_CONFLICT_POLICY=warn` cho phép gửi yêu cầu trùng nhưng chặn khi duyệt; đổi thành `block` để chặn ngay khi gửi.
