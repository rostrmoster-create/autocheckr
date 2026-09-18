cat > README.md << 'EOF'
# 🚗 AutoCheckr - Vehicle History Reports

A complete, production-ready vehicle history report platform built with Node.js, React, and PostgreSQL.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

## 🌟 Features

- **VIN Validation & Search** - 17-character VIN validation with check digit verification
- **Vehicle History Reports** - Accident history, title info, odometer readings, recalls, service records
- **User Authentication** - Secure JWT-based auth with bcrypt password hashing
- **Payment Integration** - Stripe checkout with webhook verification
- **Credit System** - Purchase report credits, unlock reports on-demand
- **Admin Dashboard** - Manage users, products, payments, and reports
- **Mock Data Mode** - Development mode with clearly marked sample data
- **Rate Limiting** - API protection against abuse
- **Responsive Design** - Mobile-first UI

## 📋 Tech Stack

### Backend
- Node.js & Express
- PostgreSQL & Sequelize ORM
- JWT Authentication
- Stripe Payments
- Winston Logger
- Helmet & CORS Security

### Frontend
- React 18
- React Router v6
- Axios
- Stripe.js
- CSS3 (Responsive)

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- PostgreSQL >= 12
- Stripe Account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/autocheckr.git
cd autocheckr
