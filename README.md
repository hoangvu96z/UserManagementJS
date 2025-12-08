
# User Management System

This is a Single Page Application (SPA) built with Angular (frontend) and Node.js/Express (backend).
It was made by VU NGUYEN  | Email : hoangvu96z@gmail.com


## 🚀 Features

### ✅ Main Functions

1. **User Registration**
   - Nickname (unique, max 40 chars)
   - Password & Confirm Password
   - Email (unique, max 40 chars)
   - Phone (up to 15 digits)
   - Country (select from list)
   - Frontend & backend validation
   - Auto-login after successful registration

2. **Login**
   - Username or Email
   - Password
   - Remember me (checkbox)
   - JWT authentication

3. **User Profile Management**
   - View personal information
   - Update nickname, phone, country
   - Email cannot be changed (for security)
   - Nickname uniqueness check

4. **Logout**
   - Remove token and redirect to login page


## 🛠 Technologies Used

### Frontend (Angular)
- **Angular 19** - Modern JavaScript framework
- **RxJS** - Reactive programming
- **TypeScript** - Type safety

### Backend (Node.js)
- **Express.js** - Web framework for Node.js
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management
- **nodemon** - Auto-restart server for development

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- NPM


### 1. Install Backend

```bash
cd backend
npm install
```

### 2. Install Frontend

```bash
cd frontend
pnpm install # or npm install
```

### 3. Run the Application

**Start Backend (Terminal 1):**
```bash
cd backend
npm run dev
```
Backend runs at: http://localhost:3000

**Start Frontend (Terminal 2):**
```bash
cd frontend
npm run start
```
Frontend runs at: http://localhost:4200


## 🔧 API Endpoints

### Authentication
- `POST /api/register` - Register a new account
- `POST /api/login` - Login
- `POST /api/logout` - Logout

### User Management
- `GET /api/user` - Get user info (requires token)
- `PUT /api/user` - Update user info (requires token)

### Utilities
- `GET /api/countries` - Get country list
- `GET /api/health` - Health check


## 🎨 User Interface

- **Responsive Design**: Works well on desktop and mobile
- **Modern UI**: Built with Angular components
- **User Experience**:
   - Loading states
   - Clear error messages
   - Real-time form validation
   - Smooth transitions and animations
   - Password visibility toggle
   - Country dropdown with search
