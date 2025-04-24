# Banking-Portal

A Single Page Application (SPA) developed for small-scale banks or financial institutions. It provides a user-friendly portal for both **customers** and **admins**, each with role-specific functionalities.

---

## 🚀 Technologies Used

- **Node.js** – Runtime environment for executing JavaScript on the server side
- **Express.js** – Web framework for Node.js
- **React.js** – Frontend library for building dynamic user interfaces
- **MongoDB** – NoSQL database for storing user and transaction data
- **Bootstrap 5** – Frontend UI framework for responsive design

---

## ✨ Key Features

### 👤 User Portal
- View account details
- View recent transactions
- Transfer funds between own accounts or other users
- Update profile details

### 🛠️ Admin Portal
- Overview and management of all users
- View all transactions or filter by:
  - User
  - Date range
  - Transaction status
- Update user profiles
- Create or delete users

---

## 📡 API Documentation & Routes

We developed separate API routes for user and admin functionalities with JWT-based authentication for security.

### 🔐 Auth APIs
- **Register**: `POST /api/users/register`  
  Registers a new user. Validates input, hashes password using `bcrypt`, and assigns a unique user ID. Two accounts are created with default balance of 10,000 and status set to `active`.

- **Login**: `GET /api/users/login`  
  Validates login credentials, and issues a JWT token valid for 1 day.

---

### 👨‍💼 Admin APIs

**Controller**: `adminController.js`

| Endpoint                | Method | Description                              |
|------------------------|--------|------------------------------------------|
| `/api/admin/getAllUsers`       | GET    | Retrieve all user information            |
| `/api/admin/createUser`        | POST   | Create a new user from admin dashboard   |
| `/api/admin/deleteUser`        | POST   | Delete a user                            |
| `/api/admin/getAllTransactions`| GET    | View all transactions by all users       |
| `/api/admin/updateUserProfile` | PUT    | Update user profile                      |

---

### 👨‍💻 User APIs

**Controller**: `userController.js`

| Endpoint                  | Method | Description                              |
|--------------------------|--------|------------------------------------------|
| `/api/users/register`    | POST   | Register new user                        |
| `/api/users/login`       | GET    | Login user and return JWT token          |
| `/api/users/updateUser`  | PUT    | Update user's own profile                |
| `/api/users/userdata`    | GET    | Fetch logged-in user's details           |

#### 🔐 Token-Based Authentication
Each request to protected routes requires a **JWT token**.  
The token payload contains the user's email or ID, which is used to fetch the relevant data.

---

## 🗃️ Working Details

### Register Flow
- Validate form input
- Hash password with `bcrypt`
- Assign unique user ID (initials + random number)
- Create two default accounts with balance = 10,000
- Set default role = `user`, status = `active`

### Login Flow
- Match email & password
- Return JWT token with 1-day expiration
- Use token to fetch session-based data

---

## 📂 Project Structure (Highlights)

Banking-Portal/ 
├── client/ # React frontend 
├── server/ # Node + Express backend 
├── README.md 

---

## 🔐 Security & Best Practices
- JWT for secure user sessions
- Passwords hashed using `bcrypt`
- Protected routes via middleware
- Validation for all input data

---

## ✉️ Feedback or Contribution
Feel free to fork the project and raise pull requests or suggestions. For bug reports or enhancements, open an issue.

---

