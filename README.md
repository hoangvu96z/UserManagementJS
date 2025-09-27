# Web App - Hệ thống quản lý người dùng

Ứng dụng web đơn trang (SPA) được xây dựng với React frontend và Node.js backend, cung cấp các chức năng đăng ký, đăng nhập, quản lý thông tin người dùng và đăng xuất.

## 🚀 Tính năng

### ✅ Các chức năng đã hoàn thành theo yêu cầu:

1. **Đăng ký tài khoản**
   - Nickname (varchar 40, duy nhất)
   - Password (varchar 40)
   - Confirm password (varchar 40)
   - Email (varchar 40, duy nhất)
   - Phone (numeric 15)
   - Country (dropdown danh sách định sẵn)
   - Validation phía frontend và backend
   - Tự động đăng nhập sau khi đăng ký thành công

2. **Đăng nhập**
   - Username hoặc Email
   - Password
   - Remember me (checkbox)
   - Xác thực JWT

3. **Quản lý thông tin người dùng**
   - Xem thông tin cá nhân
   - Cập nhật nickname, phone, country
   - Email không thể thay đổi (theo yêu cầu bảo mật)
   - Kiểm tra tính duy nhất của nickname

4. **Đăng xuất**
   - Xóa token và chuyển hướng về trang đăng nhập

## 🛠 Công nghệ sử dụng

### Frontend (React)
- **React 19.1.0** - Framework JavaScript hiện đại
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Thư viện component UI chất lượng cao
- **Lucide Icons** - Bộ icon đẹp và nhất quán
- **Axios** - HTTP client để gọi API
- **Vite** - Build tool nhanh và hiện đại

### Backend (Node.js)
- **Express.js** - Web framework cho Node.js
- **bcryptjs** - Mã hóa mật khẩu
- **jsonwebtoken** - Xác thực JWT
- **cors** - Xử lý Cross-Origin Resource Sharing
- **dotenv** - Quản lý biến môi trường
- **nodemon** - Auto-restart server khi phát triển

### Lưu trữ dữ liệu
- **JSON File** - Lưu trữ đơn giản trong file `users.json`

## 📁 Cấu trúc dự án

```
webapp-project/
├── backend/                 # Node.js Backend
│   ├── src/
│   │   ├── controllers/     # Logic xử lý request
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utilities (JWT, auth middleware)
│   │   └── app.js           # Main application file
│   ├── data/
│   │   ├── users.json       # User data storage
│   │   └── countries.json   # Countries list
│   ├── package.json
│   └── .env                 # Environment variables
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── services/        # API services
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── index.html
└── README.md
```

## 🚀 Hướng dẫn cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc pnpm

### 1. Cài đặt Backend

```bash
cd backend
npm install
```

### 2. Cài đặt Frontend

```bash
cd frontend
pnpm install
```

### 3. Chạy ứng dụng

**Chạy Backend (Terminal 1):**
```bash
cd backend
npm run dev
```
Backend sẽ chạy tại: http://localhost:3000

**Chạy Frontend (Terminal 2):**
```bash
cd frontend
pnpm run dev --host
```
Frontend sẽ chạy tại: http://localhost:5173

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - Đăng ký tài khoản mới
- `POST /api/login` - Đăng nhập
- `POST /api/logout` - Đăng xuất

### User Management
- `GET /api/user` - Lấy thông tin người dùng (yêu cầu token)
- `PUT /api/user` - Cập nhật thông tin người dùng (yêu cầu token)

### Utilities
- `GET /api/countries` - Lấy danh sách quốc gia
- `GET /api/health` - Health check

## 🔐 Bảo mật

- **Mã hóa mật khẩu**: Sử dụng bcryptjs với salt rounds = 10
- **JWT Authentication**: Token có thời hạn 24 giờ
- **CORS**: Được cấu hình để cho phép cross-origin requests
- **Validation**: Kiểm tra dữ liệu đầu vào ở cả frontend và backend
- **Email bảo mật**: Email không thể thay đổi sau khi tạo tài khoản

## 🎨 Giao diện người dùng

- **Responsive Design**: Hoạt động tốt trên desktop và mobile
- **Modern UI**: Sử dụng Tailwind CSS và shadcn/ui components
- **User Experience**: 
  - Loading states
  - Error handling với thông báo rõ ràng
  - Form validation real-time
  - Smooth transitions và animations
  - Password visibility toggle
  - Country dropdown với search

## ✅ Kiểm tra chức năng

Ứng dụng đã được kiểm tra đầy đủ các chức năng:

1. ✅ Đăng ký tài khoản với validation đầy đủ
2. ✅ Tự động đăng nhập sau khi đăng ký
3. ✅ Đăng nhập với email/username và password
4. ✅ Dashboard hiển thị thông tin người dùng
5. ✅ Cập nhật thông tin cá nhân (trừ email)
6. ✅ Đăng xuất và chuyển hướng về trang đăng nhập
7. ✅ Kiểm tra tính duy nhất của nickname và email
8. ✅ Validation form phía frontend
9. ✅ Error handling và thông báo lỗi
10. ✅ Responsive design

## 🚀 Triển khai

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && pnpm run dev --host
```

### Production
```bash
# Build frontend
cd frontend && pnpm run build

# Start backend
cd backend && npm start
```

## 📝 Ghi chú

- Ứng dụng sử dụng file JSON để lưu trữ dữ liệu, phù hợp cho demo và development
- Trong production, nên chuyển sang database như MongoDB hoặc PostgreSQL
- JWT secret key nên được thay đổi trong production
- Có thể mở rộng thêm các tính năng như reset password, email verification, etc.

## 🤝 Đóng góp

Dự án này được tạo theo yêu cầu cụ thể. Mọi đóng góp và cải tiến đều được hoan nghênh.

## 📄 License

MIT License
