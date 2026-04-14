# EMS - Employee Management System

**A full-stack web application for managing employees, clients, and services with real-time analytics dashboard.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

---

## 🎯 Features

### Core CRUD Operations

- ✅ **Add Employees** - Fill forms with all employee details (name, age, experience, salary, skills, image)
- ✅ **Edit Employees** - Update any employee profile with validation
- ✅ **Delete Employees** - Remove employees permanently from the database
- ✅ **Mark as Past** - Transition active employees to past employees status
- ✅ **View Employee Details** - Dedicated detail page with full profile info
- ✅ **Search & Filter** - Real-time search by name and filter by domain

### Clients Management

- ✅ **Add Clients** - Create client records with company info
- ✅ **View Clients** - Browse all clients with project metrics
- ✅ **Client Details Modal** - Pop-up view of client information

### Services Catalog

- ✅ **View Services** - Display all service offerings (Web, Apps, E-Commerce, Maintenance)
- ✅ **Service Metrics** - Active and completed project counts per service

### Analytics Dashboard

- ✅ **Key Metrics** - Total employees, past employees, clients, new hires this month
- ✅ **Monthly Headcount Chart** - Bar graph showing employee additions by month (Jan-Dec)
- ✅ **Department Breakdown** - Pie chart + list showing team distribution by domain
- ✅ **Real-time Updates** - Stats update immediately when data changes

### User Experience

- ✅ **Toast Notifications** - Success/error feedback for all actions
- ✅ **Loading States** - Spinner while fetching data
- ✅ **Empty States** - Helpful messages when no data available
- ✅ **Form Validation** - Client-side validation with error messages
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Navigation** - Tabbed sidebar with active state indicators

---

## 🛠 Tech Stack

### Frontend

- **React 18.3** - UI library
- **React Router v7** - Client-side routing
- **Tailwind CSS 3.4** - Utility-first styling
- **Recharts** - Charts and graphs (bar charts, pie charts)
- **React-Toastify 9.1** - Toast notifications
- **React Scripts 5.0** - Build tooling

### Backend

- **Node.js** - JavaScript runtime
- **Express 4.x** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools

- **npm** - Package manager
- **Git** - Version control

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local or Atlas connection)
- **npm** (comes with Node.js)
- **Git** (for version control)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ems.git
cd ems
```

### 2. Backend Setup

```bash
cd ems-backend

# Install dependencies
npm install

# Create .env file
# Add: MONGODB_URI=mongodb://localhost:27017/ems
# Add: PORT=5000
echo "MONGODB_URI=mongodb://localhost:27017/ems" > .env
echo "PORT=5000" >> .env

# Seed initial data (optional)
npm run seed:data

# Start backend server
node server.js
# Backend will run on http://localhost:5000
```

### 3. Frontend Setup (in a new terminal)

```bash
cd ems-frontend

# Install dependencies
npm install

# Start frontend development server
npm start
# Frontend will open at http://localhost:3000
```

### 4. Verify Setup

- Backend: Visit `http://localhost:5000/api/employees` - should return JSON
- Frontend: http://localhost:3000 opens EMS dashboard
- All sidebar links navigate correctly
- No errors in browser console (F12)

---

## 🔌 API Endpoints

### Employees

- `GET /api/employees` - List all active employees
- `GET /api/employees?status=past` - List past employees
- `GET /api/employees/:id` - Get specific employee
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `PATCH /api/employees/:id/markpast` - Mark employee as past
- `GET /api/employees/stats` - Get dashboard statistics (aggregated data)

### Clients

- `GET /api/clients` - List all clients
- `GET /api/clients/:id` - Get specific client
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Services

- `GET /api/services` - List all services
- `GET /api/services/:id` - Get specific service

---

## 📁 Project Structure

```
ems/
├── ems-backend/
│   ├── models/
│   │   ├── Employee.js          # Employee schema
│   │   ├── Client.js            # Client schema
│   │   └── Service.js           # Service schema
│   ├── routes/
│   │   ├── employees.js         # Employee CRUD + stats
│   │   ├── clients.js           # Client CRUD
│   │   └── services.js          # Service listing
│   ├── .env                     # Environment variables
│   ├── server.js                # Express app setup
│   ├── seedData.js              # Database seeding script
│   └── package.json
│
├── ems-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx      # Navigation
│   │   │   ├── StatCard.jsx     # Dashboard stat cards
│   │   │   ├── EmployeeForm.jsx # Add/Edit form
│   │   │   ├── Spinner.jsx      # Loading spinner
│   │   │   └── EmptyState.jsx   # Empty data state
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Analytics dashboard
│   │   │   ├── Employees.jsx    # Employee list
│   │   │   ├── EmployeeDetail.jsx
│   │   │   ├── AddEmployee.jsx
│   │   │   ├── ManageEmployees.jsx
│   │   │   ├── PastEmployees.jsx
│   │   │   ├── Clients.jsx
│   │   │   └── Services.jsx
│   │   ├── App.js               # Main app with routing
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── TESTING_CHECKLIST.md         # Comprehensive test plan
```

---

## 🧪 Testing

See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for complete testing guide covering:

- CRUD operations
- Search and filtering
- Dashboard functionality
- Navigation
- Empty states
- Error handling
- Browser console validation

### Quick Test

1. Add a new employee (navigate to Employees → Add New Employee)
2. Verify it appears in the list
3. Edit the employee
4. Check dashboard - total count should increase
5. Delete the employee and verify it's gone

---

## 📊 Database Schema

### Employee Model

```javascript
{
  name: String,
  age: Number,
  experience: Number,
  previousCompany: String,
  domain: String,          // Developer, QA, HR, Finance
  skills: [String],
  salary: Number,
  image: String,           // Base64 data URL
  status: String,          // "active" or "past"
  leftDate: Date,          // When marked as past
  createdAt: Date,
  updatedAt: Date
}
```

### Client Model

```javascript
{
  companyName: String,
  ceo: String,
  description: String,
  ongoingProjects: Number,
  completedProjects: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Service Model

```javascript
{
  name: String,            // Apps, Websites, E-Commerce, Maintenance
  description: String,
  activeProjects: Number,
  completedProjects: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 UI/UX Features

- **Mobile Responsive** - Sidebar collapses on tablets/phones
- **Tailwind Design** - Modern, clean interface with rounded components
- **Real-time Feedback** - Toast notifications for all actions
- **Smooth Transitions** - Hover effects, animations
- **Color Coding** - Different accent colors for domains and services
- **Dark Sidebar** - Professional dark sidebar with white text
- **Light Content** - Clean white cards on light background

---

## ⚙️ Environment Variables

### Backend (.env)

```
MONGODB_URI=mongodb://localhost:27017/ems
PORT=5000
```

### Frontend (proxy in package.json)

```
"proxy": "http://localhost:5000"
```

---

## 🐛 Known Issues & Limitations

- Images stored as Base64 strings in database (not optimal for large files)
- Single MongoDB instance (no replication)
- No authentication/authorization
- No pagination for large employee lists
- Form validation is client-side only

---

## 📈 Future Enhancements

- [ ] User authentication and authorization
- [ ] Image upload to cloud storage (Cloudinary, S3)
- [ ] Pagination and lazy loading
- [ ] Dark mode toggle
- [ ] CSV export functionality
- [ ] Email notifications
- [ ] Audit logs
- [ ] Advanced filtering and sorting
- [ ] Department management UI
- [ ] Performance metrics per employee

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss proposed changes.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

Created as a full-stack portfolio project demonstrating:

- React hooks and state management
- REST API design with Express
- MongoDB data modeling
- Responsive UI with Tailwind CSS
- Real-time search and filtering
- Data visualization with Recharts

---

## 📞 Support

For issues or questions, please open a GitHub issue or contact the project maintainer.

---

## 🎓 Learning Resources Used

- React Official Documentation
- MongoDB/Mongoose Documentation
- Tailwind CSS Docs
- Recharts Examples
- Express.js Guide

---

**Last Updated:** April 9, 2026

**Status:** ✅ Production Ready
