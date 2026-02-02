# 💰 Web3 Expense Tracker & Group Splitter

A modern, full-stack Personal Finance Management application built with a premium **Web3 Aesthetic**. Track your personal spending, categorize expenses, and split bills seamlessly with friends using real-time balance tracking.

![Web3 Design](https://img.shields.io/badge/Design-Glassmorphism-blueviolet)
![Tech Stack](https://img.shields.io/badge/Stack-MEAN-blue)

## ✨ Features

### 👤 Personal Finance
- **Web3 Dashboard**: High-fidelity visualization of your income, expenses, and total balance.
- **Transaction History**: Searchable and filterable list of all your past spending.
- **Smart Categorization**: Group your expenses into custom categories for better reporting.
- **Multi-Currency Support**: Switch between INR, USD, and other currencies with localized symbols.

### 👥 Group Expense Splitting (NEW!)
- **Collaborative Groups**: Create groups with friends (e.g., "Trip to Goa", "Roomies").
- **Smart Splitting**: Choose between **Equal Split** or **Manual Amounts**.
- **Net Balances**: View at a glance who owes money and who gets back (Live "Owes/Gets back" ledger).
- **Activity Feed**: Real-time history of shared group expenses.

### 🔒 Security & Performance
- **JWT Authentication**: Secure login and registration with token-based sessions.
- **Protected Routes**: Your financial data is private and only accessible to you.
- **Responsive Design**: Polished experience across Desktop, Tablet, and Mobile.

## 🚀 Tech Stack

- **Frontend**: Angular 17, TypeScript, Vanilla CSS (Glassmorphism), Bootstrap Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Auth**: JSON Web Tokens (JWT), BcryptJS.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/Krishnakumar-Naik/Expense-Tracker.git
cd Expense-Tracker
```

### 2. Backend Setup
```bash
cd expense-tracker-backend
npm install
```
Create a `.env` file in the root of the backend folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../expense-tracker-frontend
npm install
npm start
```

## 📸 Project Showcase
- **Dashboard**: Minimalist glassmorphism cards with gradients.
- **Groups**: Interactive member list with debt/credit indicators.
- **Splits**: Real-time calculation with manual adjustment support.

---
Built by [Krishnakumar Naik](https://github.com/Krishnakumar-Naik)
