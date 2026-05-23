# Web Bán Hàng Online - Minh Mart

## Tổng quan

Minh Mart là một demo ứng dụng bán hàng online với:

- Frontend HTML/CSS/JavaScript động.
- Backend Node.js + Express.
- Persistence bằng SQLite.
- API REST đầy đủ cho giỏ hàng, nhập kho, bán hàng và báo cáo.

## Cấu trúc dự án

- `index.html`: giao diện khách hàng và admin.
- `data.css`: style và layout.
- `data.js`: frontend tương tác API.
- `server.js`: backend Express, API và SQLite.
- `package.json`: scripts và dependencies.
- `db-schema.sql`: mô tả cấu trúc database.
- `.gitignore`: loại trừ `node_modules` và `store.db`.
- `ecosystem.config.js`: cấu hình PM2.
- `Dockerfile`: tạo image deploy.

## Tính năng chính

### Khách hàng

- Xem danh sách sản phẩm thực tế.
- Thêm sản phẩm vào giỏ hàng.
- Thanh toán và tự động giảm tồn kho.
- Xem lịch sử đơn hàng gần nhất.

### Nhân viên / quản lý

- Nhập tồn cho sản phẩm.
- Xem báo cáo theo ngày.
- Xem tồn kho hiện tại và ngày bán gần nhất.
- Truy xuất lịch sử nhập hàng và lịch sử bán hàng.

## Thêm chi tiết thực tế

- Backend hỗ trợ môi trường `PORT` và `DB_FILE`.
- Express xử lý JSON và form URL-encoded.
- API có endpoint chi tiết cho sản phẩm và số liệu tổng quan.
- Dockerfile và PM2 config để chạy như một dự án triển khai.

## Cài đặt và chạy

1. Mở terminal tại thư mục dự án.
2. Chạy `npm install`.
3. Chạy `npm start`.
4. Mở `http://localhost:3000`.

### Chạy với Docker

- Xây image: `npm run docker-build`
- Chạy container: `npm run docker-run`

### Chạy với PM2

- `npm run pm2`

## API Endpoint

- `GET /api/products` - Lấy danh sách sản phẩm.
- `GET /api/products/:id` - Lấy chi tiết một sản phẩm.
- `GET /api/sales` - Lấy lịch sử bán hàng.
- `GET /api/imports` - Lấy lịch sử nhập hàng.
- `GET /api/summary?date=YYYY-MM-DD` - Báo cáo theo ngày.
- `GET /api/overview` - Tổng quan hệ thống (tổng sản phẩm, tổng tồn kho, doanh thu, số lượng nhập).
- `POST /api/cart/checkout` - Thanh toán giỏ hàng và ghi lịch sử bán.
- `POST /api/imports` - Ghi nhận nhập kho và tăng tồn kho.
- `GET /api/health` - Kiểm tra trạng thái server.

## Database

Cấu trúc SQLite được mô tả trong `db-schema.sql`.

Bảng chính:

- `products`
- `imports`
- `sales`

> Nếu muốn khởi tạo lại dữ liệu mẫu, xóa file `store.db` và khởi động lại server.

## Lời khuyên mở rộng

- Thêm đăng nhập cho nhân viên.
- Thêm CRUD sản phẩm.
- Tách API với SPA/React cho frontend hiện đại.
- Thêm báo cáo theo tuần/tháng và biểu đồ.
