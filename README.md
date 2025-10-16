# Fresh Fruits Ecommerce Website

A full-stack ecommerce website for fresh fruits with React frontend and Node.js backend.

## Features

- User authentication (Login/Signup)
- OTP verification
- Shopping cart functionality
- Order management
- Payment integration
- Responsive design

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Nodemailer

## Installation

### Backend Setup
```bash
cd Backend
npm install
npm start
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

## Environment Variables

Create `.env` file in Backend folder:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## Project Structure

```
Fresh_Fruits/
├── Backend/
│   ├── controllers/
│   ├── Middleware/
│   ├── Model/
│   ├── Routes/
│   └── utils/
└── Frontend/
    ├── src/
    │   ├── components/
    │   ├── Pages/
    │   └── assets/
    └── public/
```