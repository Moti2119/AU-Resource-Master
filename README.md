# ResourceMaster - University Resource Management System

A full-stack web application for managing university resources, tracking inventory, and handling maintenance issues for Ambo University.

## 🚀 Features

- **User Management**: Role-based access control (Admin, Inventory Manager, Staff)
- **Resource Management**: Track resources, quantities, locations, and low stock alerts
- **Maintenance System**: Report and track maintenance issues
- **Dashboard**: Real-time overview for admins and inventory managers
- **Password Recovery**: Admin-controlled password reset system
- **Telegram Notifications**: Low stock and maintenance alerts (optional)

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- Nodemailer (for email notifications)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Hackaton
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=8000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/resourcemaster

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Email Configuration (for password reset)
EMAIL_USER=motidese122119@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:3000

# Telegram Bot (Optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Seed the Database
```bash
cd backend
npm run seed
```

This will create demo users:
- **Admin**: admin@ambouniversity.edu / admin123
- **Manager**: manager@ambouniversity.edu / manager123
- **Staff**: staff@ambouniversity.edu / staff123

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
Server will run on http://localhost:8000 (or next available port)

### Start Frontend Server
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

## 📁 Project Structure

```
Hackaton/
├── backend/
│   ├── src/
│   │   ├── config/        # Database, email, telegram config
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Seed script
│   │   └── server.js      # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   └── package.json
└── README.md
```

## 🔐 User Roles

- **Admin**: Full access, can create other admins/managers, reset passwords
- **Inventory Manager**: Manage resources and maintenance issues
- **Staff**: View resources and report maintenance issues

## 📧 Email Configuration

For password reset functionality, configure Gmail:
1. Enable 2-Step Verification in your Google Account
2. Generate an App Password
3. Add it to `EMAIL_PASSWORD` in backend `.env`

## 🎨 Branding

- Primary Color: #428bca (Ambo University Blue)
- Secondary Color: #F2B705 (Gold)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (Staff only)
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/admin/reset-password` - Admin reset password
- `GET /api/auth/me` - Get current user

### Resources
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Create resource (Admin/Manager)
- `PUT /api/resources/:id` - Update resource (Admin/Manager)
- `DELETE /api/resources/:id` - Delete resource (Admin)

### Maintenance
- `GET /api/maintenance` - Get all issues
- `POST /api/maintenance` - Create issue
- `PUT /api/maintenance/:id` - Update issue (Admin/Manager)

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create Admin/Manager
- `DELETE /api/users/:id` - Delete user

## 🐛 Troubleshooting

### Port already in use
The backend automatically tries the next available port if the default is in use.

### MongoDB connection issues
- Ensure MongoDB is running locally, or
- Update `MONGODB_URI` in `.env` with your Atlas connection string

### Email not sending
- Check Gmail App Password is correct
- Verify 2-Step Verification is enabled
- Check console logs for error messages

## 📄 License

This project is for Ambo University use.

## 👥 Contributors

Developed for Ambo University Hackathon

---

**Version 2.0** • Powered by Ambo University
