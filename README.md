# Loopr AI – Full Stack Application

A modern full-stack application with a React + TypeScript + Vite frontend and a Node.js + Express + MongoDB backend.  
Includes authentication, transaction management, analytics dashboard, and CSV export.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#️-tech-stack)
- [Live Demo](#-live-demo)
- [Folder Structure](#-folder-structure)
- [Setup Instructions](#-how-to-run-the-project)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Frontend Usage](#frontend-usage)
- [Backend Usage](#backend-usage)
- [CSV Export](#csv-export)
- [Contribution Guidelines](#-contribution-guidelines)
- [Contact](#-contact)
- [License](#license)

---

## Features

- Analyst login, logout, and JWT authentication
- Transaction filtering, and pagination
- Analytics dashboard with charts (Ant Design, Recharts)
- CSV export with column selection and filter support
- Modern UI with Ant Design and Tailwind CSS

---

## 🛠️ Tech Stack

- **Frontend:** React.js, TypeScript, Vite, Tailwind CSS, Ant Design, Recharts
- **Backend:** Node.js, Express.js, TypeScript, MongoDB (Mongoose)
- **Other:** JWT for authentication

---

### 🌐 Live Demo

Use the following login to access the dashboard

📧 Email:    analyst@looprai-demo.com  
🔑 Password: demo123

Frontend: https://loopr-ai-frontend.onrender.com
Backend API: https://loopr-ai-backend.onrender.com

🔐 Use credentials above to log in and test all features.


## 📂 Folder Structure

```
📦 loopr-ai
├── frontend/       # Frontend (React + Tailwind + Ant Design)
├── server/         # Backend (Express.js + MongoDB)
├── package.json    # Root scripts for setup
├── README.md       # Project documentation
```

---

## 🚀 How to Run the Project

### 1. Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** (local or cloud)

### 2. Clone the Repository

```bash
git clone https://github.com/Pranavaaaa/Loopr-AI.git
cd Loopr-AI
```

### 3. Install All Dependencies

```bash
npm installModules
```

This will install dependencies for both frontend and backend using the root `package.json`.

### 4. Environment Variables

Create a `.env` file in `/server` with:

```
DB_CONNECT=mongodb+srv://<username>:<password>@cluster0.mongodb.net/your-db-name
JWT_SECRET=your_jwt_secret
PORT=4000

for Evaluation Purpose use ADMIN EMAIL - analyst@looprai-demo.com and ADMIN PASSWORD - demo123
```

Adjust values as needed.

### 5. Start the Development Environment

```bash
npm run dev
```

- Backend: http://localhost:4000
- Frontend: http://localhost:5173

---

## Scripts

| Script                  | Description                                 |
|-------------------------|---------------------------------------------|
| `npm installModules`    | Installs all dependencies                   |
| `npm run dev`           | Runs backend and frontend concurrently      |
| `npm run server`        | Runs backend server only                    |
| `npm run frontend`      | Runs frontend (React/Vite) only             |

---

### 6. Load data to MongoDB using Script

First place <yourfilename>.json in `server` folder and then run following Script

## 1. First change directory to server

```bash
cd server
```

## 2. Run following Script

```bash
npm run transactions:load
```

## API Endpoints

### User Authentication

| Endpoint           | Method | Description                |
|--------------------|--------|----------------------------|
| `/users/register`  | POST   | Register a new user        |
| `/users/login`     | POST   | Login and get JWT token    |
| `/users/logout`    | GET    | Logout and blacklist token |

#### Example: Register

```http
POST /users/register
Content-Type: application/json

{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john@example.com",
  "password": "password123"
}
```

#### Example: Login

```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Transactions

| Endpoint                      | Method | Description                                   |
|-------------------------------|--------|-----------------------------------------------|
| `/transactions`               | GET    | Get paginated, filtered transactions          |
| `/transactions/export`        | GET    | Export filtered transactions as CSV           |

#### Example: Get Transactions

```http
GET /transactions?page=1&category=Revenue&status=Paid
Authorization: Bearer <token>
```

#### Example: Export CSV

```http
GET /transactions/export?columns=id,date,amount,category&status=Paid
Authorization: Bearer <token>
```

---

### Analytics

| Endpoint                                 | Method | Description                       |
|-------------------------------------------|--------|-----------------------------------|
| `/transactions/analytics/summary`         | GET    | Get revenue, expense, count stats |
| `/transactions/analytics/category`        | GET    | Get category breakdown (pie)      |
| `/transactions/analytics/trend`           | GET    | Get revenue/expense trend (line)  |

---

## Usage Examples

### Register a User

```sh
curl -X POST http://localhost:4000/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"Jane","lastname":"Smith"},"email":"jane@example.com","password":"password123"}'
```

### Login

```sh
curl -X POST http://localhost:4000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"password123"}'
```

### Get Transactions (with JWT)

```sh
curl -H "Authorization: Bearer <token>" http://localhost:4000/transactions
```

### Export CSV

```sh
curl -H "Authorization: Bearer <token>" "http://localhost:4000/transactions/export?columns=id,date,amount,category"
```

---

## Frontend Usage

- Start the frontend with `npm run frontend` or `npm run dev` (from root).
- Access the app at [http://localhost:5173](http://localhost:5173).
- Use the UI to login, view transactions, filter, export CSV, and view analytics.

---

## Backend Usage

- Start the backend with `npm run server` or `npm run dev` (from root).
- API runs at [http://localhost:4000](http://localhost:4000).
- All endpoints require JWT authentication except `/users/register` and `/users/login`.

---

## CSV Export

- Use the "Export CSV" button in the Transactions page.
- Select columns and filters as needed.
- The downloaded CSV will match your current filters and column selection.

---

## **📋 Contribution Guidelines**
We welcome contributions to improve this project! 🛠️  
1. Fork the repository.  
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes and create a pull request.

---

## **📧 Contact**
If you have any questions or suggestions, feel free to reach out:    
- **LinkedIn**: [Pranav's LinkedIn](www.linkedin.com/in/pranavlondhe)
---