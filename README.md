# 🍽️ Smart Canteen System
<img width="1280" height="682" alt="image" src="https://github.com/user-attachments/assets/7959e12d-c9d0-4594-a72a-784f3fd493ba" />
<img width="1280" height="678" alt="image" src="https://github.com/user-attachments/assets/fe6620b0-26b6-49ee-82d0-cbc3b7944d18" />


A full-stack web application for managing a smart campus canteen with real-time order tracking, admin dashboard, and student interface.

---

# 🚀 Features

### 👨‍🎓 Student
- Browse food menu
- Place orders
- View order history
- Cancel orders
- Real-time notifications

### 👨‍💼 Admin
- Manage food items (Add/Edit/Delete)
- Update food availability
- Manage orders
- View analytics dashboard

### ⚡ Real-Time
- Order status updates using Socket.IO
- Instant notifications (with optional sound)

---

# 🛠️ Tech Stack

### Frontend
- React (Vite)
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.IO

---

# 📁 Project Structure
smart-canteen/
│
├── client/ # Frontend (React)
├── server/ # Backend (Node.js)
└── README.md


---

# 🧑‍💻 How to Run This Project Locally

Follow all steps carefully.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/karanrathod7031/smart-canteen.git
cd smart-canteen

Install Backend (Server)
cd server
npm install




Setup Backend Environment Variables

Create a file named .env inside the server folder.

Paste this:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
