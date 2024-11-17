# COR'AL E-commerce PWA

COR'AL is a progressive web application (PWA) designed as an e-commerce platform for a general store selling various items such as women's wear, men's wear, accessories, makeup, bags, and more. This project is collaboratively developed by **Frontend** and **Backend** teams.

---

## 🌟 Project Overview

- **Frontend**: Built with ReactJS using Material UI for styling and UI components.  
- **Backend**: Developed with Node.js and Express.js, integrating Stripe for payments and Google Maps API for address handling.  
- **Objective**: A responsive, mobile-first e-commerce platform that delivers seamless user experience on both mobile and desktop.

---

## 🛠️ Main Technologies

### Frontend
- **ReactJS**
- **Material UI**
- **Google Maps API**
- **Stripe.js**

### Backend
- **Node.js**
- **Express.js**
- **MySQL** (via Sequelize ORM)
- **JWT** for authentication
- **Firebase** for authentication (Frontend)
- **Docker** for containerization (Optional)

---

## 📃 Project Features

### Frontend Features
1. **Landing Page**
   - Hero section with a carousel of featured categories.
   - "New Arrivals" and "Handpicked Collections" sections.
   - "Shop By" sections with filters for categories, brands, and popular items.
   - Search bar for quick product discovery.
   - Responsive footer with quick links to categories and featured sections.

2. **Category Page**
   - Displays products from a selected category.
   - Pagination (20 products per page).

3. **Product Page**
   - Detailed product view with title, description, pricing, discounts, and ratings.
   - Related products section.
   - Ratings and reviews (read-only).

4. **My Cart Page**
   - Editable cart with "Proceed to Checkout" button.
   - Discount calculations and delivery fee integration.

5. **Checkout Page**
   - Collects user information (name, mobile, email, location).
   - "Place Order" button for order confirmation.

6. **Login/Sign Up**
   - Firebase-based authentication.

### Backend Features
1. **Authentication**
   - JWT-based authentication.
   - Role-based access control (Admin & User).

2. **Product Management**
   - CRUD operations for products.
   - Support for categories, brands, discounts, and ratings.

3. **Simulated Payments**
   - Stripe integration with test payment processing.

4. **Error Handling**
   - Robust error handling with meaningful messages and status codes.

5. **Admin Insights**
   - Statistical reports: Top-selling products, unsold products, and trends by region.

6. **Optional Enhancements**
   - Dockerized deployment.
   - Redis caching for frequently accessed data.
   - Load testing with tools like Apache JMeter or Locust.
   - API monitoring with Grafana and Prometheus.
