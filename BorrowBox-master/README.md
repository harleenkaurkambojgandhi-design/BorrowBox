# 📦 BorrowBox – Item, Guidance & Chat Request System

A full-stack community platform where users can request items, seek guidance, chat in real time, and manage borrow interactions. BorrowBox connects people who need something with those who can provide it — quickly and conveniently.

---

## 🚀 Tech Stack

### **Frontend**
- React 18+
- React Router DOM
- Axios
- Bootstrap 5
- Lucide React

### **Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt.js
- Socket.io (real-time chat)
- CORS

### **Middlewares Used**
- `auth.js` – JWT verification middleware
- `errorHandler.js` – Centralized error handler

### **Database**
- MongoDB Atlas (Cloud)

---

## ✨ Features

### 🔐 Authentication System
- User signup and login using JWT
- Password hashing with bcrypt
- User details stored (name, gender, phone, area)
- Protected backend routes using authentication middleware

---

### 📋 Request Management
- Create Item Requests (books, tools, electronics, etc.)
- Create Guidance Requests (tutoring, skill help, advice, etc.)
- Request flow: **Pending → Accepted → Completed**
- View all requests or user-specific requests
- Live status updates on each request card

---

### 💬 Real-Time Chat System (WebSockets)
- One-to-one chat between requester and provider
- Built using Socket.io
- Chat rooms created per request
- Instant message delivery
- All chat history saved in database

---

### ⭐ Rating System
- Providers rate users after completing a request
- Auto-calculated average rating
- Full rating history available
- "New User" badge for unrated users

---

### 👤 Profile Management
- View and edit personal details
- Shows user ratings and activity
- Displays member-since date and area

---

### 🔍 Search & Filters
- Filter by **Item** or **Guidance**
- Search across names, areas, items, and topics
- Sort by rating, area, or recent activity
- Real-time, responsive filtering

---

### 📱 Responsive UI
- Mobile-first design
- Bootstrap 5 responsive layout
- Clean and intuitive UI for all devices

## 🏗️ Project Structure

```
borrowbox-system/
├── server/                               # Backend (Node.js + Express + MongoDB)
│   ├── config/                           # Configuration files (DB, etc.)
│   │   └── index.js                      # MongoDB connection setup
│   │
│   ├── controllers/                      # Controllers: handle request logic
│   │   ├── chatController.js             # Chat creation, fetch, message handling
│   │   ├── ratingController.js           # Rating create/fetch logic
│   │   ├── requestController.js          # Borrow requests CRUD + status updates
│   │   └── userController.js             # Signup, login, profile, auth actions
│   │
│   ├── middlewares/                      # Middleware for auth & error handling
│   │   ├── auth.js                       # JWT auth check, protects routes
│   │   └── errorHandler.js               # Global error handler for API
│   │
│   ├── models/                           # Mongoose models (database schemas)
│   │   ├── Chat.js                       # Chat room schema between two users
│   │   ├── ChatMessage.js                # Individual messages schema
│   │   ├── Rating.js                     # Rating given by a user to another
│   │   ├── Request.js                    # Borrow request schema (item, status)
│   │   └── User.js                       # User account schema
│   │
│   ├── routes/                           # All API route definitions
│   │   ├── chatRoutes.js                 # Chat-related API endpoints
│   │   ├── ratingRoutes.js               # Rating-related API endpoints
│   │   ├── requestRoutes.js              # Borrow request endpoints
│   │   └── userRoutes.js                 # Authentication + user routes
│   │
│   ├── websocket/                        # WebSocket (Socket.io) real-time logic
│   │   ├── chatSocket.js                 # Socket handlers for chat messages
│   │   └── index.js                      # Socket.io server integration
│   │
│   └── index.js                          # Main Express server entry point
│
├── src/                                  # *****Frontend (React + Vite)******
│   ├── components/                       # Reusable UI components
│   │   ├── ChatMessage.jsx               # Single chat bubble component
│   │   ├── LoadingSpinner.jsx            # Loader animation component
│   │   ├── Navbar.jsx                    # Top navigation bar
│   │   ├── RatingModal.jsx               # Popup modal for giving ratings
│   │   └── RequestCard.jsx               # UI card for each posted request
│   │
│   ├── context/                          # React Context API
│   │   └── AuthContext.jsx               # Stores user auth state globally
│   │
│   ├── pages/                            # All application pages/screens
│   │   ├── AddRequestPage.jsx            # Form to create a new borrow request
│   │   ├── ChatListPage.jsx              # List of chats for the logged-in user
│   │   ├── ChatPage.jsx                  # Main chat window with messages
│   │   ├── LoginPage.jsx                 # User login page
│   │   ├── MainPage.jsx                  # Homepage after logging in
│   │   ├── ProfilePage.jsx               # User profile + rating info
│   │   ├── RequestsPage.jsx              # View all available requests
│   │   └── SignupPage.jsx                # User signup/registration page
│   │
│   ├── services/                         # API calls to backend
│   │   └── api.js                        # Axios instance + all API endpoints
│   │
│   ├── chat.css                          # Chat UI styling
│   ├── App.jsx                           # Main component with routes
│   ├── index.css                         # Global styling
│   └── main.jsx                          # React entry point (Vite)
│
├── .env                                  # Environment variables
├── .gitignore                            # Files ignored by Git
├── index.html                            # Main HTML template (Vite)
├── package.json                          # Project dependencies + scripts
└── package-lock.json                     # Lock file for exact dependency versions

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn package manager
- MongoDB connection string

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd borrowbox-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb+srv://jashan:jashan@borrowboxcluster.af1swpn.mongodb.net/?retryWrites=true&w=majority&appName=borrowBoxCluster
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
PORT=5000
```

4. **Start the application**

**Development mode (runs both frontend and backend):**
```bash
npm run dev
```

**Alternatively, run separately:**

Backend only:
```bash
npm run server
```

Frontend only:
```bash
npm run client
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📱 Usage Instructions

### Getting Started
1. **Create an Account**: Sign up with your details including name, email, password, gender, phone, and area
2. **Browse Requests**: View all pending requests on the main page
3. **Filter & Search**: Use filters to find specific types of requests or search by keywords
4. **Accept Requests**: Click "Accept Request" to help someone

### Making Requests
1. **Add Request**: Click "Add New Request" from the navigation or main page
2. **Choose Type**: Select either "Item Request" or "Guidance Request"
3. **Fill Details**: 
   - **Item**: Name, quantity, and when you need it
   - **Guidance**: Topic and time needed
4. **Add Description**: Optional details about your request
5. **Submit**: Your request will appear on the main feed

### Managing Requests
1. **My Requests**: View all your requests and their status
2. **Helping Others**: See requests you've accepted
3. **Mark Complete**: Providers can mark requests as completed
4. **Rate Users**: After completion, rate the requestor's experience

### Profile Management
1. **View Profile**: Check your rating, member details, and received ratings
2. **Edit Information**: Update name, phone number, and area
3. **Rating History**: View all ratings you've received with comments

## 🔮 Future Improvements

### Real-time Features
- WebSocket integration for live notifications
- Real-time request status updates
- Chat system between requestors and providers

### Enhanced Functionality
- Request categories and tags
- Advanced matching algorithms
- Request scheduling and reminders
- Image uploads for item requests

### Community Features
- User verification badges
- Community leaderboards
- Request history analytics
- Report and moderation system

### Mobile App
- React Native mobile application
- Push notifications
- Offline mode capabilities
- Location-based matching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email [support@borrowbox.com](mailto:support@borrowbox.com) or create an issue in the repository.

---

**Built with ❤️ using React, Node.js, Express, and MongoDB**
