# 🛒 TechVault360

### A Full-Stack E-Commerce Web Application

TechVault360 is a modern full-stack e-commerce platform built with **React, Vite, Node.js, Express.js, and MongoDB**.

It provides a complete online shopping experience with product browsing, categories, authentication, wishlist, cart management, checkout, order tracking, and an admin dashboard.

---

## 🚀 Features

### 👤 User Features

- User Registration
- User Login
- JWT-based Authentication
- User Dashboard
- Browse Products
- Product Categories
- Product Search
- Product Details
- Add Products to Cart
- Update Cart Quantity
- Remove Products from Cart
- Wishlist Management
- Checkout
- Order Placement
- Order Success Page
- Order History
- Responsive User Interface

### 🛍️ Product Features

- Multiple Product Categories
- Product Images
- Product Descriptions
- Product Pricing
- Stock Availability
- Product Details Page
- Quantity Selection
- Add to Cart
- Wishlist Button

### 👨‍💼 Admin Features

- Admin Authentication
- Admin Dashboard
- Product Management
- Order Management
- Customer Management
- View Total Orders
- View Total Products
- View Total Users
- View Total Revenue
- Product Upload Support

---

## 🛠️ Technologies Used

### Frontend

- React.js
- Vite
- React Router
- JavaScript
- CSS
- Lucide React Icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- CORS
- dotenv
- Multer

---

## 📁 Project Structure

```text
ecommerce/
│
├── client/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── layout/
│       │   └── product/
│       ├── context/
│       ├── pages/
│       │   ├── admin.jsx
│       │   ├── cart.jsx
│       │   ├── category.jsx
│       │   ├── checkout.jsx
│       │   ├── dashboard.jsx
│       │   ├── home.jsx
│       │   ├── login.jsx
│       │   ├── order-success.jsx
│       │   ├── orders.jsx
│       │   ├── product.jsx
│       │   ├── productdetails.jsx
│       │   └── register.jsx
│       ├── screens/
│       ├── services/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── docs/
│   └── screenshots/
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authcontroller.js
│   │   └── ordercontroller.js
│   ├── middleware/
│   │   ├── adminmiddleware.js
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── order.js
│   │   ├── product.js
│   │   └── user.js
│   ├── routes/
│   │   ├── adminroutes.js
│   │   ├── authroutes.js
│   │   ├── orderroutes.js
│   │   ├── productroutes.js
│   │   └── uploadroutes.js
│   ├── utils/
│   │   └── seeddata.js
│   ├── seedproducts.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── LICENSE
├── package.json
└── README.md