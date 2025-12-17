# Luxury Chauffeur Booking System

A full-stack web application for managing a **luxury owner-driver chauffeur service** specializing in **Matric Dances** and **Weddings**. The system allows clients to submit booking requests based on fixed-rate packages, while administrators manually approve requests before clients are redirected to secure payment.

---

## Table of Contents

1. Project Overview
2. Key Features
3. User Roles
4. Technology Stack
5. System Architecture
6. Repository Structure
7. Installation & Setup
8. Environment Variables
9. Payment Flow
10. Admin Approval Workflow
11. Security Considerations
12. Future Enhancements

---

## 1. Project Overview

The Luxury Chauffeur Booking System is designed to provide a professional online booking experience for high-end chauffeur services. It supports a controlled booking lifecycle where **payment is only initiated after manual admin approval**, ensuring availability is confirmed with the owner-driver prior to charging the client.

The system is suitable for:

* Luxury chauffeur businesses
* Event-based transport services
* Fixed-rate booking workflows

---

## 2. Key Features

### Client Features

* Browse available luxury vehicles
* View Matric Dance and Wedding service packages
* Submit detailed booking requests
* Track booking status in real time
* Secure payment after admin approval

### Admin Features

* Centralized dashboard for all bookings
* Manual booking approval or rejection
* Vehicle and pricing management (CRUD)
* Internal driver assignment notes
* Payment tracking and invoice generation

---

## 3. User Roles

### Client (Passenger)

* Requests bookings
* Views booking status
* Completes payment after approval

### Admin (Operator / Dispatcher)

* Reviews and manages booking requests
* Confirms availability externally with drivers
* Approves or declines bookings
* Manages vehicles, pricing, and packages

### Driver

* Exists outside the system
* Communicated with directly by admin

---

## 4. Technology Stack

### Frontend

* React.js
* JavaScript (ES6+)
* Tailwind CSS
* React Router DOM

### Backend

* Node.js
* Express.js
* JavaScript (ES6+)

### Database

* PostgreSQL (recommended) or MongoDB
* Prisma ORM or Mongoose

### Payments

* Stripe or PayGate

### Authentication

* JWT-based authentication (Admin)

---

## 5. System Architecture

The application follows a **client–server architecture**:

* React frontend communicates with the backend via RESTful APIs
* Node.js backend handles business logic, approvals, and payments
* Database stores bookings, vehicles, packages, and transactions

---

## 6. Repository Structure

```
luxury-chauffeur-booking-system/
│
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   └── App.jsx
│   └── package.json
│
├── backend/                  # Node.js API
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   ├── app.js
│   └── package.json
│
├── docs/                     # Documentation
│   ├── api-spec.md
│   ├── database-schema.md
│   └── system-architecture.md
│
├── README.md
└── .gitignore
```

---

## 7. Installation & Setup

### Prerequisites

* Node.js (v18+ recommended)
* npm
* PostgreSQL or MongoDB

### Clone the Repository

```
git clone https://github.com/your-username/luxury-chauffeur-booking-system.git
cd luxury-chauffeur-booking-system
```

### Backend Setup

```
cd backend
npm install
npm run dev
```

### Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 8. Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_payment_key
```

---

## 9. Payment Flow

1. Client submits booking request
2. Booking status is set to `Pending`
3. Admin manually confirms availability
4. Admin approves booking
5. Backend generates payment session
6. Client is redirected to payment gateway
7. Payment confirmation updates booking status

---

## 10. Admin Approval Workflow

* All bookings start in a `Pending` state
* Admin reviews booking details
* Availability is confirmed externally
* Approval triggers payment redirection
* Declined bookings notify the client

---

## 11. Security Considerations

* HTTPS enforced
* JWT-based admin authentication
* Password hashing using bcrypt
* Secure payment processing via PCI-compliant gateways
* Input validation and sanitization

---

## 12. Future Enhancements

* Automated availability calendar
* SMS and WhatsApp notifications
* Driver mobile portal
* Analytics dashboard
* Multi-vehicle bookings

---

## License

This project is proprietary and intended for commercial use. Licensing terms to be defined by the project owner.

---

## Author

Developed as a full-stack web solution using Node.js, JavaScript, and React.
