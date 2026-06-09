# College ERP System

A comprehensive Enterprise Resource Planning (ERP) application designed for colleges and universities. This system manages academic activities, student data, staff profiles, attendance, fees, examinations, and library resources.

## 🚀 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** SQLite (default for local setup) / MySQL / PostgreSQL via Sequelize ORM

## 🔑 Default Login Credentials

Upon the first run, the database is automatically seeded with default accounts:

| Role    | Email                | Password     |
|---------|----------------------|--------------|
| Admin   | `admin@eduerp.com`   | `Admin@123`  |
| Teacher | `teacher@eduerp.com` | `Teacher@123`|
| Staff   | `staff@eduerp.com`   | `Staff@123`  |
| Student | `student@eduerp.com` | `Student@123`|

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/balamanikandanb191/ERP-College-Project.git
   cd ERP-College-Project
   ```

2. **Backend Setup**
   ```bash
   cd college-erp-backend
   npm install
   ```

   *By default, the backend is configured to use SQLite. If you want to use MySQL or PostgreSQL, update the `DB_DIALECT` and credentials in `college-erp-backend/.env`.*

3. **Start the Application**
   ```bash
   npm start
   ```
   The backend will start on port 5000 and automatically serve the built frontend.

4. **Access the App**
   Open your browser and navigate to: `http://localhost:5000`

## 📦 Project Structure

- `college-erp-backend/` - Node.js Express server, Sequelize models, API routes
- `college-erp-frontend/` - React application (Vite)
- `mysql_schema.sql` - Complete database schema dump
- `docker-compose.yml` - Docker setup for external database if needed
