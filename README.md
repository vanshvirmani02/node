# Multi-Vendor Order Management System  
**Node.js (Express) Backend + React Frontend**  

A full-stack solution for vendors to manage products, customers to place multi-vendor orders, and admins to track analytics.  

---

## 🚀 Features  
### **Backend (Node.js/Express)**  
- **JWT Authentication** with roles: `admin`, `vendor`, `customer`  
- **RBAC Middleware** for protected routes  
- **Product Management** (CRUD operations for vendors)  
- **Order Processing**  
  - Auto-split orders by vendor  
  - Stock validation & deduction (transaction-safe)  
- **Analytics**  
  - Revenue per vendor (30 days)  
  - Top-selling products  
  - Low-stock alerts (vendor-specific)  

### **Frontend (React)**  
- Vendor dashboard (product/order management)  
- Customer order flow  
- Admin analytics views  

---

## ⚙️ Setup  

### **Prerequisites**  
- Node.js ≥ 16  
- MongoDB (local or Atlas URI)  
- Git  

### **1. Backend Setup**  
```bash
# Clone repo
git clone [your-repo-link]
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.

# Start the server (dev mode)
npm run dev


### **2. Frontend Setup**  
```bash
cd frontend
npm install
npm start  # Runs on http://localhost:3000
```

---

## 📂 Project Structure  
### **Backend**  
```
src/
├── controllers/    # Route handlers
├── models/         # MongoDB schemas
├── middleware/     # Auth & RBAC
├── routes/         # API endpoints
├── services/       # Business logic
├── utils/          # Helpers (JWT, error handling)
└── app.js          # Express setup
```

### **Frontend**  
```
src/
├── components/     # Reusable UI
├── pages/          # Views (Admin, Vendor, Customer)
├── hooks/          # Custom hooks
├── context/        # Auth state
└── api/            # Axios requests to backend


## 📬 Contact  
For questions, email: [your-email@example.com]  
